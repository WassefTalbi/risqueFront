
import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { CategorieService } from 'src/app/core/services/categorie.service';
import { ToastrService } from 'ngx-toastr'; 

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
  editCategoryId:any
  files: File[] = [];
  categoryForm!: UntypedFormGroup;
  categoryFormEdit!: UntypedFormGroup;
  submitted = false;
  term: any;
  categorieslist: any;
  fileLogo: File | null = null;
  addCategorieError: string | null = null;
  logoUrl:any
  @ViewChild('addCategoryModal', { static: false }) addCategoryModal?: ModalDirective;
  @ViewChild('editCategoryModal', { static: false }) editCategoryModal?: ModalDirective;
  @ViewChild('removeItemModal', { static: false }) removeItemModal?: ModalDirective;
  deleteId: any;
  colors = ['primary', 'success', 'danger', 'warning', 'info', 'secondary', 'dark'];
  constructor(private categorieService:CategorieService, private formBuilder: UntypedFormBuilder,private toastr: ToastrService ) {
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
    this.categoryFormEdit = this.formBuilder.group({
      nom: ['', [Validators.required]],
      logo: [null]
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
        categorie.color = this.colors[Math.floor(Math.random() * this.colors.length)];
        return categorie;
      });
      this.categorieslist = this.categories;
    });

  }

  public dropzoneConfig: DropzoneConfigInterface = {
    clickable: true,
    addRemoveLinks: true,
    previewsContainer: false,
  };


    onUploadSuccess(event: any) {
      setTimeout(() => {
        this.fileLogo = event.target.files[0];
        this.logoUrl=null
      }, 0);
    }


  removeFile(event: any) {
    this.fileLogo=null;
  
  }
  saveCategoryModalHide(){
    this.addCategoryModal?.hide(); 
    this.categoryForm.reset();
    this.fileLogo = null;
  }
  saveCategory() {
    if (this.categoryForm.valid) {
      const registerData = new FormData();
      registerData.append('nom', this.categoryForm.value.nom);
  
      if (this.fileLogo) {
        registerData.append('logo', this.fileLogo);
      }
  
      this.categorieService.addCategorie(registerData).subscribe(
        response => {
          console.log('Categorie added successfully:', response);
          this.addCategoryModal?.hide();
          this.toastr.success('Catégorie ajoutée avec succès', 'Succès');
          this.categoryForm.reset();
          this.fileLogo = null;
        
          this.loadCategories();
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
          } else {
            this.addCategorieError = 'Une erreur inattendue est survenue, essayez encore';
          }
  
          this.toastr.error(this.addCategorieError || 'Erreur, veuillez réessayer', 'Erreur');
        }
      );
    }
  }



  editCategoryModalHide(){
    this.editCategoryModal?.hide();
    this.categoryFormEdit.reset();
    this.fileLogo = null;
  }

  editCategory(id: any) {
    this.categorieService.getCategorieById(id).subscribe((categorie: any) => {
      this.editCategoryId = id;
      this.categoryFormEdit.patchValue({
        nom: categorie.nom,
      });
      this.fileLogo = null; // Reset the fileLogo
      this.logoUrl =`http://localhost:1919/user/image/${categorie.logo}`;
      this.editCategoryModal?.show();
    });
}

updateCategory() {
    this.submitted = true;
    if (this.categoryFormEdit.valid) {
      const updateData = new FormData();
      updateData.append('nom', this.categoryFormEdit.value.nom);
      if (this.fileLogo) {
        updateData.append('logo', this.fileLogo);
      }
      this.categorieService.editCategorie(this.editCategoryId, updateData).subscribe(
        response => {
          this.toastr.success('categorie mis à jour avec succès !', 'Succès');  
          console.log('categorie updated successfully:', response);
          this.loadCategories();
         this.editCategoryModalHide();
        },
        error => {
          this.toastr.error('Erreur lors de la mise à jour de categorie.', 'Erreur'); 
          console.error('Error updating actif:', error);
        }
      );
    }
}
  
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

