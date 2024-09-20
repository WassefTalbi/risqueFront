import { Component, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { reviews } from './data';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { RisqueService } from 'src/app/core/services/risque.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-risque',
  templateUrl: './risque.component.html',
  styleUrl: './risque.component.scss'
})
export class RisqueComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  risqueForm!: UntypedFormGroup;
  reviewData: any;
  submitted: boolean = false;
  deleteId: any;
  files: File[] = [];
  rate: any;
  currentTab = 'description';
  addRisqueError: string | null = null;
  currentActifId!: string|null;
  risque:any;
  actif:any;
  @ViewChild('addReview', { static: false }) addReview?: ModalDirective;
  @ViewChild('addRisqueModal', { static: false }) addRisqueModal?: ModalDirective;
  @ViewChild('removeItemModal', { static: false }) removeItemModal?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;

  constructor(private formBuilder: UntypedFormBuilder,private risqueService:RisqueService,private route: ActivatedRoute) { }


  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Actif', active: true },
      { label: 'Risque', active: true }
    ];

    this.getCurrentActifId();
    this.loadRisque();
    /**
 * Form Validation
 */
    this.risqueForm = this.formBuilder.group({
      nom: [''],
      valeurFinanciere: ['', [Validators.required]],
      probabilite: ['', [Validators.required]],
      priorite: ['', [Validators.required]],
      valeurBaseImpact: ['', [Validators.required]],
      actifId: [this.currentActifId, [Validators.required]],
  
    });

    // Fetch Data
    this.reviewData = reviews.reverse()
  }

  public dropzoneConfig: DropzoneConfigInterface = {
    clickable: true,
    addRemoveLinks: true,
    previewsContainer: false,
  };





  // Change Tab Content
  changeTab(tab: string) {
    this.currentTab = tab;
  }




  // open & close chatbox
  openchatbox() {
    document.getElementById('emailchat-detailElem')?.classList.add('d-block')
  }
  closechatbox() {
    document.getElementById('emailchat-detailElem')?.classList.remove('d-block')
  }

  // Edit Review
  editReview(id: any) {
 /*
    this.addReview?.show()
    this.reviewForm.controls['_id'].setValue(this.reviewData[id].id);
    this.reviewForm.controls['title'].setValue(this.reviewData[id].title);
    this.reviewForm.controls['rate'].setValue(this.reviewData[id].rating);
    this.reviewForm.controls['content'].setValue(this.reviewData[id].content);
    this.reviewData[id].profile.forEach((element:any) => {
      this.uploadedFiles.push({ 'dataURL': element, 'name': 'image', 'size': 1024, });
    });
    this.reviewForm.controls['img'].setValue(this.uploadedFiles);
  */
  }
  getCurrentActifId(){
    this.route.paramMap.subscribe(params => {
      this.currentActifId = params.get('id');
      console.log(this.currentActifId); 
    });
  }
  loadRisque() {
    this.risqueService.getActifById(this.currentActifId).subscribe((data) => {
      this.actif=data
      this.risque = data.risque;
      console.log('risque of actif',data.risque)
   
    });
   
}
  // Add Review
  saveRisque() {
    if (this.risqueForm.valid) {
      const registerData = new FormData();
      registerData.append('nom', this.risqueForm.value.nom);
      registerData.append('valeurFinanciere', this.risqueForm.value.valeurFinanciere);
      registerData.append('probabilite', this.risqueForm.value.probabilite);
      registerData.append('priorite', this.risqueForm.value.priorite);
      registerData.append('valeurBaseImpact', this.risqueForm.value.valeurBaseImpact);
      registerData.append('actifId', this.risqueForm.value.actifId);

   
      console.log(registerData)
      this.risqueService.addRisque(registerData).subscribe(
        response => {
          this.risqueForm.reset();
          this.loadRisque();
          this.addRisqueModal?.hide();
       
        },
        error => {
          if (error.status === 400) {
            let errorMessage = '';
            for (const field in error.error) {
              if (error.error.hasOwnProperty(field)) {
                errorMessage += `./ ${error.error[field]} <br>`;
              }
            }
            this.addRisqueError = errorMessage.trim();
          } else if (error.status === 409) {
            this.addRisqueError = error.error;
          } else {
            this.addRisqueError = 'An unexpected error occurred during registration, try again';
          }
        }
      );
    }

  }

  // Delete Review
  removeReview(id: any) {
    this.deleteId = id
    this.removeItemModal?.show()
  }

  DeleteReview() {
    this.reviewData.splice(this.deleteId, 1)
    this.removeItemModal?.hide()
  }
}
