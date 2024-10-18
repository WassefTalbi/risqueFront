
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { Store } from '@ngrx/store';
import { CategorieService } from 'src/app/core/services/categorie.service';
import { ActifService } from 'src/app/core/services/actif.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ToastrService } from 'ngx-toastr'; 

@Component({
  selector: 'app-actif',

  templateUrl: './actif.component.html',
  styleUrl: './actif.component.scss',
  providers: [DecimalPipe]
})


export class ActifComponent {

  breadCrumbItems!: Array<{}>;
  actifForm!: UntypedFormGroup;
  risqueForm!: UntypedFormGroup;
  addActifError: string | null = null;
  term: any
  submitted = false;
  gridlist: any;
  endItem: any
  listData!: any;
  masterSelected!: boolean;
  files: File[] = [];
  categories: any;
  actifs: any;
  listactif!: any;
  logoUrl:any
  selectedCategoryId: string | null = null;
  fileLogo: File | null = null;
  editActifId: number | null = null;
  originalLogo!:string;
  role:any;
  @ViewChild('addActifModal', { static: false }) addActifModal?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  @ViewChild('addRisqueModal', { static: false }) addRisqueModal?: ModalDirective;
  @ViewChild('editActifModal', { static: false }) editActifModal?: ModalDirective;


  @ViewChild('stepModal') stepModal: any;
  
  steps = [
    { title: ' Actif', content: 'Step 1 Content' },
    { title: 'Risque', content: 'Step 2 Content' },
  
  ];
  
  currentStep = 0;
  modalTitle = 'Step Form';
  

  currentForm!: FormGroup;

 
  deleteID: any;
  editData: any;

  constructor(private formBuilder: UntypedFormBuilder, public store: Store,private authService: AuthenticationService,
     private categorieService:CategorieService,private actifService:ActifService,private fb: FormBuilder, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.initializeForms();

    this.role=this.authService.currentUser()['scope']
    console.log('role in the actif ',this.role);
  

    this.breadCrumbItems = [
      { label: 'Actifs', active: true },
     
    ];

    
    setTimeout(() => {
      this.loadCategories();
      this.loadActifs()
      document.getElementById('elmLoader')?.classList.add('d-none')
    }, 1000)

    this.actifForm = this.formBuilder.group({
      nom: [''],
      logo:  [null],
      categorieId: ['', [Validators.required]],
      description: ['', [Validators.required]],
      valeurDonnees: ['', [Validators.required]],
      priorite: ['', [Validators.required]],
      valeurFinanciere: ['', [Validators.required]],
  
    });

    this.risqueForm = this.formBuilder.group({
      nom: [''],
      valeurFinanciere: ['', [Validators.required]],
      probabilite: ['', [Validators.required]],
      priorite: ['', [Validators.required]],
      valeurBaseImpact: ['', [Validators.required]],
    
  
    });

  }
  initializeForms(): void {
    this.actifForm = this.fb.group({
      logo: [null, Validators.required],
      nom: ['', Validators.required],
      description: ['', Validators.required],
      priorite: [null, Validators.required],
      valeurDonnees: [null, Validators.required],
      valeurFinanciere: [null, Validators.required],
      categorieId: [null, Validators.required]
    });

    this.risqueForm = this.fb.group({
      nom: ['', Validators.required],
      priorite: [null, Validators.required],
      probabilite: [null, Validators.required],
      valeurBaseImpact: [null, Validators.required],
      valeurFinanciere: [null, Validators.required]
    });

    this.currentForm = this.fb.group({});
  }

 
  get form() {
    return this.actifForm.controls;
  }

  public dropzoneConfig: DropzoneConfigInterface = {
    clickable: true,
    addRemoveLinks: true,
    previewsContainer: false,
  };

  uploadedFiles: any[] = [];



  
  loadCategories() {
    this.categorieService.getCategories().subscribe((data) => {
      console.log(data)
      this.categories = data;
    
    
    });

  }
  loadActifs() {
      this.actifService.getActifs().subscribe((data) => {
        this.actifs = data;
        this.listactif=data;
      });
    
  }
  loadActifsByCategorie() {
  
  if (this.selectedCategoryId === null || this.selectedCategoryId === "null") {
    this.loadActifs();
  } else {
    
    this.actifService.getActifsByCategorie(this.selectedCategoryId).subscribe((data) => {
      this.actifs = data;
      this.listactif = data;
    });
  }
   
  }
  onUploadSuccess(event: any) {
    setTimeout(() => {
      this.fileLogo = event.target.files[0];
      this.logoUrl=null
    }, 0);
  }


  editActifModalHide(){
    this.editActifModal?.hide()
    this.actifForm.reset()
    this.fileLogo = null;
   } 
   
  editActif(id: any) {
      this.actifService.getActifById(id).subscribe((actif: any) => {
        console.log(actif)
        this.editActifId = id;
        this.originalLogo = actif.logo; 
        this.actifForm.patchValue({
          nom: actif.nom,
          description: actif.description,
          priorite:actif.priorite,
          valeurDonnees: actif.valeurDonnees,
          valeurFinanciere: actif.valeurFinanciere,
          categorieId:actif.categorie.id
          
        });
        this.fileLogo = null; // Reset the fileLogo
        this.logoUrl =`http://localhost:1919/user/image/${actif.logo}`;
        this.editActifModal?.show();
      });
  }
  
  updateActif() {
      this.submitted = true;
      if (this.actifForm.valid) {
        const updateData = new FormData();
        updateData.append('nom', this.actifForm.value.nom);
        updateData.append('description', this.actifForm.value.description);
        updateData.append('priorite', this.actifForm.value.priorite);
        updateData.append('valeurDonnees', this.actifForm.value.valeurDonnees);
        updateData.append('valeurFinanciere', this.actifForm.value.valeurFinanciere);
        updateData.append('categorieId', this.actifForm.value.categorieId);
        if (this.fileLogo) {
          updateData.append('logo', this.fileLogo);
        }
        this.actifService.editActif(this.editActifId, updateData).subscribe(
          response => {
            this.toastr.success('Actif mis à jour avec succès !', 'Succès');  
            console.log('actif updated successfully:', response);
            this.loadActifs();
           this.editActifModalHide();
          },
          error => {
            this.toastr.error('Erreur lors de la mise à jour de l\'actif.', 'Erreur'); 
            console.error('Error updating actif:', error);
          }
        );
      }
  }

  removeItem(id: any) {
    this.deleteID = id
    this.deleteRecordModal?.show()
  }

  confirmDelete() {
    this.actifService.removeActif(this.deleteID).subscribe(data=>{
      this.toastr.success('Actif supprimé avec succès !', 'Succès');
      this.loadActifs();
      this.deleteRecordModal?.hide()}
      ,error=>{
      this.toastr.error('Erreur lors de la suppression de l\'actif.', 'Erreur');
      console.log(error)
    });
  }

  filterdata() {
    if (this.term) {
      this.actifs = this.listactif.filter((el: any) => el.nom.toLowerCase().includes(this.term.toLowerCase()))
    } else {
      this.actifs = this.listactif.slice(0,10)
    }
    this.updateNoResultDisplay();
  }

  updateNoResultDisplay() {
    const noResultElement = document.getElementById('noresult') as HTMLElement;
    const paginationElement = document.getElementById('pagination-element') as HTMLElement
    if (this.term && this.actifs.length === 0) {
      noResultElement.classList.remove('d-none')
      paginationElement.classList.add('d-none')
    } else {
      noResultElement.classList.add('d-none')
      paginationElement.classList.remove('d-none')
    }
  }

  showModal(): void {
    this.currentStep = 0;
   
    (this.stepModal as any).show();
  }

  hideModal(): void {
    (this.stepModal as any).hide();
  }

  setStep(index: number): void {
    if (index >= 0 && index < this.steps.length) {
      this.currentStep = index;
    }
  }

  prevStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  nextStep(): void {
    if (this.currentStep === 0 && this.actifForm.valid) {
      this.currentStep++;
    } else if (this.currentStep === 1 && this.risqueForm.valid) {
      this.currentStep++;
    } else {
      this.markFormGroupTouched(this.currentStep === 0 ? this.actifForm : this.risqueForm);
    }
  }

  markFormGroupTouched(formGroup: UntypedFormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof UntypedFormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  onSubmit(): void {
    if (this.actifForm.valid && this.risqueForm.valid) {
      const registerData = new FormData();
      registerData.append('nom', this.actifForm.value.nom);
      registerData.append('categorieId', this.actifForm.value.categorieId);
      registerData.append('priorite', this.actifForm.value.priorite);
      registerData.append('description', this.actifForm.value.description);
      registerData.append('valeurDonnees', this.actifForm.value.valeurDonnees);
      registerData.append('valeurFinanciere', this.actifForm.value.valeurFinanciere);
      if (this.fileLogo) {
        registerData.append('logo', this.fileLogo);
      }

      registerData.append('risqueNom', this.risqueForm.value.nom);
      registerData.append('risqueValeurFinanciere', this.risqueForm.value.valeurFinanciere);
      registerData.append('probabilite', this.risqueForm.value.probabilite);
      registerData.append('risquePriorite', this.risqueForm.value.priorite);
      registerData.append('valeurBaseImpact', this.risqueForm.value.valeurBaseImpact);

      this.actifService.addActif(registerData).subscribe(
        response => {
          this.hideModal();
          this.toastr.success('Actif ajouté avec succès !', 'Succès'); 
          this.actifForm.reset();
          this.risqueForm.reset();
          this.fileLogo = null;
          this.loadActifs();
           
          
        },
        error => {
          this.toastr.error('Erreur lors de l\'ajout de l\'actif.', 'Erreur'); 

          console.log("Error", error);
        }
      );
    } else {
      this.markFormGroupTouched(this.actifForm);
      this.markFormGroupTouched(this.risqueForm);
    }
  }
  


  
}

