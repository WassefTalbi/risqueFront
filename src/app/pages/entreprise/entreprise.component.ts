import { Component,ViewChild } from '@angular/core';

import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { EntrepriseService } from 'src/app/core/services/entreprise.service';


@Component({
  selector: 'app-entreprise',
  templateUrl: './entreprise.component.html',
  styleUrl: './entreprise.component.scss',
  providers: [DecimalPipe]
})






export class EntrepriseComponent {

 
  breadCrumbItems!: Array<{}>;
  entreprises: any;
  entreprisesList: any
  endItem: any
  entrepriseForm!: UntypedFormGroup;
  submitted: boolean = false;
  addEntrepriseError: string | null = null;
  itemsPerPage=10;
  @ViewChild('addEntrepriseModal', { static: false }) addEntrepriserModal?: ModalDirective;
  @ViewChild('removeItemModal', { static: false }) removeItemModal?: ModalDirective;
  @ViewChild('editEntrepriseModal', { static: false }) editEntrepriseModal?: ModalDirective;
  editEntrepriseId: number | null = null;
  deleteId: any;
  sellerChart: any;
  term: any;
  fileLogo: File | null = null;
  constructor(private formBuilder: UntypedFormBuilder, private entrepriseService:EntrepriseService) {
  }

  ngOnInit(): void {
 
    this.breadCrumbItems = [
      { label: 'Entreprise', active: true },
      { label: 'Listes', active: true }
    ];


    this.entrepriseForm = this.formBuilder.group({
    
      nom: ['', [Validators.required]],
      domaine: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      adresse: ['', [Validators.required]],
      logo: [null, Validators.required]
    });

    setTimeout(() => {
     this.loadEntreprises();
    
      document.getElementById('elmLoader')?.classList.add('d-none')
    }, 1200)
  }

  public dropzoneConfig: DropzoneConfigInterface = {
    clickable: true,
    addRemoveLinks: true,
    previewsContainer: false,
  };

  
 
  

  onUploadSuccess(event: any) {
    setTimeout(() => {
      this.fileLogo = event.target.files[0];
    }, 0);
  }


  removeFile(event: any) {
    this.fileLogo=null;
  
  }


  loadEntreprises() {
    this.entrepriseService.getEntreprisesswithPaginationAndSorting(0, this.itemsPerPage, 'nom').subscribe((data) => {
      this.entreprises = data.content;
      this.entreprisesList = data.content;
        this.entreprises = this.entreprisesList.slice(0, 10);
     
    })
  }
  editEntrepriseModalHide(){
   this.editEntrepriseModal?.hide()
   this.entrepriseForm.reset()
   this.fileLogo = null;
    }
  addEntrepriseModalHide(){
      this.addEntrepriserModal?.hide()
      this.entrepriseForm.reset()
      this.fileLogo = null;
       }
 
  // Load selected entreprise data into the form
  editEntreprise(id: any) {
    this.entrepriseService.getEntrepriseById(id).subscribe((entreprise: any) => {
      this.editEntrepriseId = id;
      this.entrepriseForm.patchValue({
        nom: entreprise.nom,
        domaine: entreprise.domaine,
        email: entreprise.email,
        adresse: entreprise.adresse
      });
      this.editEntrepriseModal?.show();
    });
  }

  // Method to update entreprise details
  updateEntreprise() {
    this.submitted = true;
    if (this.entrepriseForm.valid) {
      const updateData = new FormData();
      updateData.append('nom', this.entrepriseForm.value.nom);
      updateData.append('domaine', this.entrepriseForm.value.domaine);
      updateData.append('email', this.entrepriseForm.value.email);
      updateData.append('adresse', this.entrepriseForm.value.adresse);
      if (this.fileLogo) {
        updateData.append('logo', this.fileLogo);
      }

      this.entrepriseService.editEntreprise(this.editEntrepriseId, updateData).subscribe(
        response => {
          console.log('Entreprise updated successfully:', response);
          this.loadEntreprises();
          this.editEntrepriseModal?.hide();
          this.fileLogo = null;
        },
        error => {
          console.error('Error updating entreprise:', error);
        }
      );
    }
  }



 
  saveEntreprise() {
    if (this.entrepriseForm.valid) {
      const registerData = new FormData();
      registerData.append('nom', this.entrepriseForm.value.nom);
      registerData.append('domaine', this.entrepriseForm.value.domaine);
      registerData.append('email', this.entrepriseForm.value.email);
      registerData.append('adresse', this.entrepriseForm.value.adresse);
      if (this.fileLogo) {
        registerData.append('logo', this.fileLogo);
      }
      this.entrepriseService.addEntreprise(registerData).subscribe(
        response => {
         
          console.log('Entreprise added successfully:', response);
          setTimeout(() => {
            this.entrepriseForm.reset();
            this.loadEntreprises();
            this.addEntrepriserModal?.hide();
          }, 1000);
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
           
            this.addEntrepriseError = errorMessage.trim();
          }else if(error.status === 409){
                this.addEntrepriseError=error.error
          }
           else {
            this.addEntrepriseError = 'An unexpected error occurred during registration ,try again';
          }
        }
      )
       
      setTimeout(() => {
        this.entrepriseForm.reset();
      }, 1000);
      this.fileLogo=null;
      //this.uploadedFiles = [];
      this.addEntrepriserModal?.hide()
    }
  }


  
  removeEntreprise(id: any) {
    this.deleteId = id;
    this.removeItemModal?.show()
  }


  deleteEntreprise() {
    this.entrepriseService.removeEntreprise(this.deleteId).subscribe(data=>{
      this.loadEntreprises();
      this.removeItemModal?.hide()
    },error=>{
      console.log(error)
    });
    
   
    
  }

  pageChanged(event: any): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    this.endItem = event.page * event.itemsPerPage;
    this.entreprises = this.entreprisesList.slice(startItem, this.endItem);
  }


  filterdata() {
    if (this.term) {
      console.log(this.term)
      this.entreprises = this.entreprisesList.filter((es: any) => es.nom.toLowerCase().includes(this.term.toLowerCase()) || es.adresse.toLowerCase().includes(this.term.toLowerCase()))
    } else {
      this.entreprises = this.entreprisesList.slice(0, 8);
    }
 
      this.updateNoResultDisplay();
  }


  updateNoResultDisplay() {
    const noResultElement = document.getElementById('noresult') as HTMLElement;
    const paginationElement = document.getElementById('pagination-element') as HTMLElement
    if (this.term && this.entreprises.length === 0) {
      noResultElement.classList.remove('d-none')
      paginationElement.classList.add('d-none')
    } else {
      noResultElement.classList.add('d-none')
      paginationElement.classList.remove('d-none')
    }
  }

}
