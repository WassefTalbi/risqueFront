import { Component, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr'; 
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { ProjetService } from 'src/app/core/services/projet.service';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-list',
  templateUrl: './projet.component.html',
  styleUrl: './projet.component.scss',
  providers: [DecimalPipe]
})

// List component
export class ProjetComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  projets: any;
  projetList: any
  itemsPerPage=10;
  addProjetError: string | null = null;
  deleteID: any;
  endItem: any
  projetForm!: UntypedFormGroup;
  projetFormEdit!: UntypedFormGroup;
  submitted = false;
  assignList: any;
  reassignList:any;
  editProjetId:any;
  departementId:any;
  term: any
  role:any
  @ViewChild('addProjet', { static: false }) addProjet?: ModalDirective;
  @ViewChild('editProjetModal', { static: false }) editProjetModal?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  assignedId: any = null;  
  assignto: any =null;
  reassignedId: any = null;  
  reassignto: any =null;
  editData: any;
  tooltipPosition: number = 0;
  currentDepartementId!: any;
  constructor(private formBuilder: UntypedFormBuilder, public datepipe:DatePipe,
    private projetService:ProjetService,private route: ActivatedRoute,private authService: AuthenticationService,private toastr: ToastrService) {}

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Entreprise', active: true },
      { label: 'Departement', active: true },
      { label: 'Projets', active: true }
    ];
    this.role=this.authService.currentUser()['scope']
    console.log('role in the projet details ',this.role);
    /**
     * Form Validation
     */
    this.projetForm = this.formBuilder.group({
     
      nom: ['', [Validators.required]],
      description: ['', [Validators.required]],
      dateDebut: ['', [Validators.required]],
      dateFin: ['', [Validators.required]],
      avancement: ['', [Validators.required]],
      etat: ['', [Validators.required]]
    });
    this.projetFormEdit = this.formBuilder.group({
     
      nom: ['', [Validators.required]],
      description: ['', [Validators.required]],
      dateDebut: ['', [Validators.required]],
      dateFin: ['', [Validators.required]],
      avancement: ['', [Validators.required]],
      etat: ['', [Validators.required]]
    });

   this.getCurrentDepartement();

    setTimeout(() => {
      this.loadProjets();
    }, 1000)

   this.loadUsersAssignToChef();
  }




  addProjetModalHide(){
    this.addProjet?.hide();
    this.projetForm.reset();
    this.assignedId = null;  
      this.assignto = null;
  
  }


  editProjetModalHide(){
    this.editProjetModal?.hide();
    this.projetFormEdit.reset();
    this.assignedId = null;  
    this.assignto = null;
    this.departementId=null
  
  }

  editProjet(id: any) {
    this.projetService.getProjetById(id).subscribe((projet: any) => {
      this.editProjetId = id;
      console.log(projet)
      this.projetFormEdit.patchValue({
        nom: projet.nom,
        description: projet.description,
        dateDebut: this.datepipe.transform(projet.dateDebut, 'yyyy-MM-dd'),
        dateFin: this.datepipe.transform(projet.dateFin, 'yyyy-MM-dd'),
        avancement: projet.avancement,
        etat: projet.etat,
      });
      this.reassignedId=projet.chefProjet.id
      this.reassignto=projet.chefProjet
      this.departementId=projet.departement.id
      this.editProjetModal?.show();
    });
}

updateProjet() {
    this.submitted = true;
    if (this.projetFormEdit.valid) {
      const updateData = {
        nom: this.projetFormEdit.value.nom,
        description: this.projetFormEdit.value.description,
        chefProjetId: this.reassignto.id,
        departementId: this.departementId,
        dateDebut: this.projetFormEdit.value.dateDebut,
        dateFin: this.projetFormEdit.value.dateFin,  
        avancement: this.projetFormEdit.value.avancement,
        etat: this.projetFormEdit.value.etat
      };
      console.log("update projet data",updateData);
      
      this.projetService.editProjet(this.editProjetId, updateData).subscribe(
        response => {
          this.toastr.success('projet mis à jour avec succès !', 'Succès');  
          console.log('projet updated successfully:', response);
          this.loadProjets();
         this.editProjetModalHide();
        },
        error => {
          this.toastr.error('Erreur lors de la mise à jour de projet.', 'Erreur'); 
          console.error('Error updating projet:', error);
        }
      );
    }
}

  getCurrentDepartement(){
    this.route.paramMap.subscribe(params => {
      this.currentDepartementId = params.get('id');
     
    });
  }

  loadProjets() {
    this.projetService.getProjetsByDepartement(0, this.itemsPerPage, 'nom',this.currentDepartementId).subscribe((data) => {
      this.projets = data.content;
      this.projetList = data.content;
        this.projets = this.projetList.slice(0, 10);
    });
    document.getElementById('elmLoader')?.classList.add('d-none')
  }
 
  loadUsersAssignToChef(){
    this.projetService.getUsersAssignToChef().subscribe((data) => {
      this.assignList = data;
      this.reassignList = data;
      
    });
    
  }
 

  updateTooltip(event: Event) {
    const input = event.target as HTMLInputElement;
    input.title = input.value;
  }

  addAssign(id: any) {
    if (this.assignedId === id) {
      this.assignedId = null;  
      this.assignto = null;  
  } else {
      this.assignedId = id;
      this.assignto = this.assignList[id];
  }
   
  }
  
  reAssign(id: any) {
    console.log("projet assigned chef Id"+id)
    if (this.reassignedId === id) {
      this.reassignedId = null;  
     this.reassignto = null;  
  } else {
      this.reassignedId = id;
      const foundChef = this.reassignList.find((chefProjet:any) => chefProjet.id === id);
      this.reassignto = foundChef;
  }
  }


  saveProjet() {
    if (this.projetForm.valid) {
      const registerData = {
        nom: this.projetForm.value.nom,
        description: this.projetForm.value.description,
        departementId: this.currentDepartementId,
        chefProjetId: this.assignto.id,
        dateDebut: this.projetForm.value.dateDebut,
        dateFin: this.projetForm.value.dateFin,  
        avancement: this.projetForm.value.avancement,
        etat: this.projetForm.value.etat
      };
      this.projetService.addProjet(registerData).subscribe(
        response => {
          console.log('Projet added successfully:', response);
          this.toastr.success('Projet ajouté avec succès!', 'Succès');
          setTimeout(() => {
            this.projetForm.reset();  
            this.loadProjets();      
            this.addProjet?.hide();  
          }, 1000);
        },
        error => {
            if (error.status === 400) {
              let errorMessage = '';
              for (const field in error.error) {
                if (error.error.hasOwnProperty(field)) {
                  errorMessage += `./ ${error.error[field]} <br>`;
                }
              }
              this.addProjetError = errorMessage.trim();
              
              // Show error toast
              this.toastr.error('Une erreur s\'est produite lors de l\'ajout du projet.', 'Erreur');
            } else if (error.status === 409) {
              this.addProjetError = error.error;
              
              // Show conflict error toast
              this.toastr.warning('Conflit de données lors de l\'ajout du projet.', 'Avertissement');
            } else {
              this.addProjetError = 'Une erreur inattendue s\'est produite lors de l\'inscription du projet, veuillez réessayer.';
              
              // Show generic error toast
              this.toastr.error('Une erreur inattendue s\'est produite. Veuillez réessayer.', 'Erreur');
            }
        }
      );
    }
  }
  
  

  checkedValGet: any[] = [];

  checkUncheckAll(ev: any) {
    this.projets = this.projets.map((x: { states: any }) => ({ ...x, states: ev.target.checked }));
    var checkedVal: any[] = [];
    var result;
    for (var i = 0; i < this.projets.length; i++) {
      if (this.projets[i].states == true) {
        result = this.projets[i].id;
        checkedVal.push(result);
      }
    }

    this.checkedValGet = checkedVal;
    checkedVal.length > 0 ? document.getElementById("remove-actions")?.classList.remove('d-none') : document.getElementById("remove-actions")?.classList.add('d-none');
  }

  // Select Checkbox value Get
  onCheckboxChange(e: any) {
    var checkedVal: any[] = [];
    var result
    for (var i = 0; i < this.projets.length; i++) {
      if (this.projets[i].states == true) {
        result = this.projets[i].id;
        checkedVal.push(result);
      }
    }
    this.checkedValGet = checkedVal
    checkedVal.length > 0 ? document.getElementById("remove-actions")?.classList.remove('d-none') : document.getElementById("remove-actions")?.classList.add('d-none');
  }


  // Delete Product
  removeItem(id: any) {
    this.deleteID = id
    this.deleteRecordModal?.show()
  }

  deleteData(id: any) {
    this.deleteRecordModal?.hide();
    if (id) {
      this.projetService.deleteProjet(this.deleteID).subscribe(data=>{
        this.loadProjets();
        this.deleteRecordModal?.hide();
        this.toastr.success('Projet supprimé avec succès!', 'Succès'); 

      },error=>{
        this.toastr.error('Une erreur s\'est produite lors de la suppression du projet.', 'Erreur'); 

      });
    }
  

  
  }
  // Sort Data
  direction: any = 'asc';
  onSort(column: any) {
    if (this.direction == 'asc') {
      this.direction = 'desc';
    } else {
      this.direction = 'asc';
    }
    const sortedArray = [...this.projets]; 
    sortedArray.sort((a, b) => {
      const res = this.compare(a[column], b[column]);
      return this.direction === 'asc' ? res : -res;
    });
    this.projets = sortedArray;
  }
  compare(v1: string | number, v2: string | number) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  filterdata() {
    if (this.term) {
      this.projets = this.projetList.filter((es: any) => es.nom.toLowerCase().includes(this.term.toLowerCase()))
    } else {
      this.projets = this.projetList.slice(0, 10);
    }

    this.updateNoResultDisplay();
  }


  updateNoResultDisplay() {
    const noResultElement = document.querySelector('.noresult') as HTMLElement;
    const paginationElement = document.getElementById('pagination-element') as HTMLElement;

    if (this.term && this.projets.length === 0) {
      noResultElement.classList.remove('d-none')
      paginationElement.classList.add('d-none')

    } else {
      noResultElement.classList.add('d-none')
      paginationElement.classList.remove('d-none')
    }
  }
  
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    this.endItem = event.page * event.itemsPerPage;
    this.projets = this.projetList.slice(startItem, this.endItem);
  }
}



