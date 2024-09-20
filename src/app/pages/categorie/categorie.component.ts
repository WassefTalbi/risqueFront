
import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';


import { CategorieService } from 'src/app/core/services/categorie.service';

@Component({
  selector: 'app-categorie',
  templateUrl: './categorie.component.html',
  styleUrl: './categorie.component.scss',
  providers: [DecimalPipe]
 
})
export class CategorieComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  categories: any;
  files: File[] = [];
  categoryForm!: UntypedFormGroup;
  submitted = false;
  term: any;
  categorieslist: any;
  fileLogo: File | null = null;
  addCategorieError: string | null = null;
  @ViewChild('addCategoryModal', { static: false }) addCategoryModal?: ModalDirective;
  @ViewChild('removeItemModal', { static: false }) removeItemModal?: ModalDirective;
  deleteId: any;
  colors = ['primary', 'success', 'danger', 'warning', 'info', 'secondary', 'dark'];
  constructor(private categorieService:CategorieService, private formBuilder: UntypedFormBuilder,) {
  }


  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Categorie', active: true }
      
    ];

    /**
      * Form Validation
    */
    this.categoryForm = this.formBuilder.group({
      nom: ['', [Validators.required]],
      logo: [null, Validators.required]
    });

    // Fetch Data
    setTimeout(() => {
     this.loadCategories();
      document.getElementById('elmLoader')?.classList.add('d-none')
    }, 1000)
  }




  loadCategories() {
    this.categorieService.getCategories().subscribe((data) => {
      console.log(data)
      this.categories = data.map((categorie: any) => {
        // Assign a random color to each category
        categorie.color = this.colors[Math.floor(Math.random() * this.colors.length)];
        return categorie;
      });
      this.categorieslist = this.categories;
    });

  }

  // File Upload
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

  // Add Category
  saveCategory() {
    if (this.categoryForm.valid) {
      const registerData = new FormData();
      registerData.append('nom', this.categoryForm.value.nom);
   
      if (this.fileLogo) {
        registerData.append('logo', this.fileLogo);
      }
      this.categorieService.addCategorie(registerData).subscribe(
        response => {
         
          console.log('categorie added successfully:', response);
          setTimeout(() => {
            this.categoryForm.reset();
            this.loadCategories();
            this.addCategoryModal?.hide();
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
           
            this.addCategorieError = errorMessage.trim();
          }else if(error.status === 409){
                this.addCategorieError=error.error
          }
           else {
            this.addCategorieError = 'An unexpected error occurred during registration ,try again';
          }
        }
      )
       
      setTimeout(() => {
        this.categoryForm.reset();
      }, 1000);
      this.fileLogo=null;
      //this.uploadedFiles = [];
      this.addCategoryModal?.hide()
    }
   
  }


  // no result 
  updateNoResultDisplay() {
    const noResultElement = document.querySelector('.noresult') as HTMLElement;
    const paginationElement = document.getElementById('pagination-element') as HTMLElement
    if (this.term && this.categories.length === 0) {
      noResultElement.style.display = 'block';
      paginationElement.classList.add('d-none')
    } else {
      noResultElement.style.display = 'none';
      paginationElement.classList.remove('d-none')
    }
  }


  removeCategorie(id: any) {
    this.deleteId = id;
    this.removeItemModal?.show()
  }


  deleteCategorie() {
    this.categorieService.removeCategorie(this.deleteId).subscribe(data=>{
      this.loadCategories();
      this.removeItemModal?.hide()
    },error=>{
      console.log(error)
    });
  }

}

