

import { Component, ViewChild, ViewChildren } from '@angular/core';

import { Observable } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { DepartementService } from 'src/app/core/services/departement.service';
import { ActivatedRoute } from '@angular/router';
import { EntrepriseService } from 'src/app/core/services/entreprise.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ToastrService } from 'ngx-toastr'; 

@Component({
  selector: 'app-seller-overview',
  templateUrl: './departement.component.html',
  styleUrl: './departement.component.scss',
  providers: [DecimalPipe]
})

export class DepartementComponent {
  departements: any;
  departementList: any
  itemsPerPage=10;
  addDepartementError: string | null = null;
  entreprise:any;
  breadCrumbItems!: Array<{}>;
  term: any
  deleteID: any;
  files: File[] = [];
  departementForm!: UntypedFormGroup;
  departementFormEdit!: UntypedFormGroup;
  logoUrl:any
  editDepartementId:any;
  submitted = false;
  masterSelected!: boolean;
  endItem: any
  currentEntrepriseId!: string|null;
  role:any;
  @ViewChild('addDepartementModal', { static: false }) addDepartementModal?: ModalDirective;
  @ViewChild('editDepartementModal', { static: false }) editDepartementModal?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  
  fileLogo: File | null = null; 

  constructor(private formBuilder: UntypedFormBuilder, private departementService:DepartementService,
    private entrepriseService:EntrepriseService,private route: ActivatedRoute,private authService: AuthenticationService, private toastr: ToastrService) {
  }


  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Entreprise', active: true },
      { label: ' Departements', active: true }
    ];
    this.role=this.authService.currentUser()['scope']
    console.log('role in the departement ',this.role);
   this.getCurrentEntrepriseId();
   this.loadCurrentEntreprice();
    /**
     * Form Validation
     */
    this.departementForm = this.formBuilder.group({
     
      nom: ['', [Validators.required]],
      valeurEconomique: ['', [Validators.required]],
      priorite: ['', [Validators.required]],
      logo: [null, Validators.required]
    });
    this.departementFormEdit = this.formBuilder.group({
     
      nom: ['', [Validators.required]],
      valeurEconomique: ['', [Validators.required]],
      priorite: ['', [Validators.required]],
      logo: [null]
    });
 
    // fetch data
    setTimeout(() => {

      this.loadDepartements();

   
    }, 1000)
  }

  public dropzoneConfig: DropzoneConfigInterface = {
    clickable: true,
    addRemoveLinks: true,
    previewsContainer: false,
  };

  getCurrentEntrepriseId(){
    this.route.paramMap.subscribe(params => {
      this.currentEntrepriseId = params.get('id');
      console.log(this.currentEntrepriseId); 
    });
  }
 loadCurrentEntreprice(){
  this.entrepriseService.getEntrepriseById(this.currentEntrepriseId).subscribe((data) => {
    this.entreprise = data;
 
   
  });
 }
  loadDepartements() {
    this.departementService.getDepartementByEntreprise(0, this.itemsPerPage, 'nom',this.currentEntrepriseId).subscribe((data) => {
      this.departements = data.content;
      this.departementList = data.content;
        this.departements = this.departementList.slice(0, 10);
        console.log(data.content)
     
    });
    document.getElementById('elmLoader')?.classList.add('d-none')
  }
 
  onUploadSuccess(event: any) {
    setTimeout(() => {
      this.fileLogo = event.target.files[0];
      this.logoUrl=null
    }, 0);
  }

  // File Remove
  removeFile(event: any) {
    this.fileLogo =null;
  }

  // Add Sorting
  direction: any = 'asc';
  sortKey: any = ''
  onSort(column: any) {
    if (this.direction == 'asc') {
      this.direction = 'desc';
    } else {
      this.direction = 'asc';
    }
    const sortedArray = [...this.departementList]; // Create a new array
    sortedArray.sort((a, b) => {
      const res = this.compare(a[column], b[column]);
      return this.direction === 'asc' ? res : -res;
    });
    this.departementList = sortedArray;
  }
  compare(v1: string | number, v2: string | number) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }
  editDepartementModalHide(){
    this.editDepartementModal?.hide()
    this.departementFormEdit.reset()
    this.fileLogo = null;
     }
  addDepartementModalHide(){
    this.addDepartementModal?.hide()
    this.departementForm.reset()
    this.fileLogo = null;
  }
  saveDepartement() {
    if (this.departementForm.valid) {
      const registerData = new FormData();
      registerData.append('nom', this.departementForm.value.nom);
      registerData.append('valeurEconomique', this.departementForm.value.valeurEconomique);
      registerData.append('priorite', this.departementForm.value.priorite);
  
      if (this.fileLogo) {
        registerData.append('logo', this.fileLogo);
      }
  
      this.departementService.addDepartement(registerData, this.currentEntrepriseId).subscribe(
        response => {
          this.addDepartementModal?.hide();
          this.toastr.success('Département ajouté avec succès!', 'Succès');
          this.loadDepartements();
          this.departementForm.reset();
          this.fileLogo = null;
        },
        error => {
          if (error.status === 400) {
            let errorMessage = '';
            for (const field in error.error) {
              if (error.error.hasOwnProperty(field)) {
                errorMessage += `./ ${error.error[field]} <br>`;
              }
            }
            this.addDepartementError = errorMessage.trim();
            this.toastr.error(this.addDepartementError, 'Erreur');
          }  else {
            this.addDepartementError = 'Une erreur inattendue est survenue lors de l\'enregistrement, réessayez.';
            this.toastr.error(this.addDepartementError, 'Erreur');
          }
        }
      );
    }
  }
  
 
  editDepartement(id: any) {
    this.departementService.getDepartmentById(id).subscribe((departement: any) => {
     this.editDepartementId=id
      this.departementFormEdit.patchValue({
        nom: departement.nom,
        valeurEconomique: departement.valeurEconomique,
        priorite: departement.priorite,
       
      });
      this.fileLogo = null; // Reset the fileLogo
      this.logoUrl =`http://localhost:1919/user/image/${departement.logo}`;
      this.editDepartementModal?.show();
    });
  }
  updateDepartement() {
    this.submitted = true;
    if (this.departementFormEdit.valid) {
      const updateData = new FormData();
      updateData.append('nom', this.departementFormEdit.value.nom);
      updateData.append('valeurEconomique', this.departementFormEdit.value.valeurEconomique);
      updateData.append('priorite', this.departementFormEdit.value.priorite);

      if (this.fileLogo) {
        updateData.append('logo', this.fileLogo);
      }

      this.departementService.editDepartement(this.editDepartementId, updateData).subscribe(
        response => {
          this.toastr.success('Departement mise à jour avec succès!', 'Succès');
          console.log('Entreprise updated successfully:', response);
          this.loadDepartements();
          this.editDepartementModal?.hide();
          this.fileLogo = null;
        },
        error => {
          this.toastr.error('Erreur lors de la mise à jour de l\'entreprise.', 'Erreur');
          console.error('Error updating entreprise:', error);
        }
      );
    }
  }
  checkedValGet: any[] = [];

  checkUncheckAll(ev: any) {
    this.departementList.forEach((x: { state: any; }) => x.state = ev.target.checked)
    var checkedVal: any[] = [];
    var result
    for (var i = 0; i < this.departementList.length; i++) {
      if (this.departementList[i].state == true) {
        result = this.departementList[i].id;
        checkedVal.push(result);
      }
    }
    this.checkedValGet = checkedVal
    checkedVal.length > 0 ? document.getElementById("remove-actions")?.classList.remove('d-none') : document.getElementById("remove-actions")?.classList.add('d-none');
  }

 
  onCheckboxChange(e: any) {
    var checkedVal: any[] = [];
    var result
    for (var i = 0; i < this.departementList.length; i++) {
      if (this.departementList[i].states == true) {
        result = this.departementList[i].id;
        checkedVal.push(result);
      }
    }
    this.checkedValGet = checkedVal
    checkedVal.length > 0 ? document.getElementById("remove-actions")?.classList.remove('d-none') : document.getElementById("remove-actions")?.classList.add('d-none');
  }

  removeItem(id: any) {
    this.deleteID = id
    this.deleteRecordModal?.show()
  }

  deleteData() {

    this.departementService.removeDepartement(this.deleteID).subscribe(
      response => {
        this.toastr.success('Département supprimé avec succès!', 'Succès');
        this.loadDepartements();
        this.deleteRecordModal?.hide();
        this.masterSelected = false;
      },
      error => {
        this.toastr.error('Erreur lors de la suppression du département.', 'Erreur');
      }
    );
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    this.endItem = event.page * event.itemsPerPage;
    this.departementList = this.departements.slice(startItem, this.endItem);
  }

  filterdata() {
    if (this.term) {
      this.departementList = this.departements.filter((el: any) => el.nom.toLowerCase().includes(this.term.toLowerCase()) || el.nom.toLowerCase().includes(this.term.toLowerCase()))
    } else {
      this.departementList = this.departements.slice(0, 10);
    }
    this.updateNoResultDisplay();
  }

  updateNoResultDisplay() {
    const noResultElement = document.querySelector('.noresult') as HTMLElement;
    const paginationElement = document.getElementById('pagination-element') as HTMLElement;
    if (this.term && this.departementList.length === 0) {
      noResultElement.style.display = 'block';
      paginationElement.classList.add('d-none')
    } else {
      noResultElement.style.display = 'none';
      paginationElement.classList.remove('d-none')
    }
  }
}
