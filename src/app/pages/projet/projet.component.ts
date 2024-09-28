





import { Component, ViewChild } from '@angular/core';

// Get Modal
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { addticketlistData, deleteticketlistData, fetchsupporticketsData, fetchticketlistData, updateticketlistData } from 'src/app/store/Tickets/ticket.actions';

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
  submitted = false;
  assignList: any;
  term: any
  role:any
  @ViewChild('addProjet', { static: false }) addProjet?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  assignedId: any = null;  
  assignto: any =null;
  editData: any;
  tooltipPosition: number = 0;
  currentDepartementId!: any;
  constructor(private formBuilder: UntypedFormBuilder, public datepipe:DatePipe,
    private projetService:ProjetService,private route: ActivatedRoute,private authService: AuthenticationService) {
  }

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

   this.getCurrentDepartement();

    setTimeout(() => {
      this.loadProjets();
    }, 1000)

   this.loadUsersAssignToChef();
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
      
    });
    
  }
 

  updateTooltip(event: Event) {
    const input = event.target as HTMLInputElement;
    input.title = input.value;
  }

  // Add Assigne
  addAssign(id: any) {
    if (this.assignedId === id) {
      this.assignedId = null;  
      this.assignto = null;  
  } else {
      this.assignedId = id;
      this.assignto = this.assignList[id];
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
          } 
          // Handle conflict errors (status 409)
          else if (error.status === 409) {
            this.addProjetError = error.error;
          }
          // Handle other unexpected errors
          else {
            this.addProjetError = 'An unexpected error occurred during project registration, please try again.';
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
      },error=>{
        console.log(error)
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
    const sortedArray = [...this.projets]; // Create a new array
    sortedArray.sort((a, b) => {
      const res = this.compare(a[column], b[column]);
      return this.direction === 'asc' ? res : -res;
    });
    this.projets = sortedArray;
  }
  compare(v1: string | number, v2: string | number) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }


  // filterdata
  filterdata() {
    if (this.term) {
      this.projets = this.projetList.filter((es: any) => es.nom.toLowerCase().includes(this.term.toLowerCase()))
    } else {
      this.projets = this.projetList.slice(0, 10);
    }
    // noResultElement
    this.updateNoResultDisplay();
  }

  // no result 
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

  // pagechanged
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    this.endItem = event.page * event.itemsPerPage;
    this.projets = this.projetList.slice(startItem, this.endItem);
  }
}



