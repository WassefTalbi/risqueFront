import { Component, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { reviews } from './data';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { RisqueService } from 'src/app/core/services/risque.service';
import { ActivatedRoute } from '@angular/router';
import { VulnerabiliteService } from 'src/app/core/services/vulnerabilite.service';

@Component({
  selector: 'app-risque',
  templateUrl: './risque.component.html',
  styleUrl: './risque.component.scss'
})
export class RisqueComponent {


  // bread crumb items
  breadCrumbItems!: Array<{}>;
  vulnerabiliteForm!: UntypedFormGroup;
  menaceForm!: UntypedFormGroup;
  reviewData: any;
  submitted: boolean = false;
  deleteId: any;
  files: File[] = [];
  rate: any;
  currentTab = 'description';
  addVulnerabiliteError: string | null = null;
  addMenaceError: string | null = null;
  currentActifId!: string|null;
  checkedVulnerabiliteId!: string;
  risque:any;
  actif:any;
  vulnerabilites!:any[];
  @ViewChild('addReview', { static: false }) addReview?: ModalDirective;
  @ViewChild('addVulnerabiliteModal', { static: false }) addVulnerabiliteModal?: ModalDirective;
  @ViewChild('addMenaceModal', { static: false }) addMenaceModal?: ModalDirective;
  @ViewChild('removeItemModal', { static: false }) removeItemModal?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;

  constructor(private formBuilder: UntypedFormBuilder,private risqueService:RisqueService,private vulnerabiliteService:VulnerabiliteService,private route: ActivatedRoute) { }


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
    this.loadVulnerabilites();
    /**
 * Form Validation
 */
    this.vulnerabiliteForm = this.formBuilder.group({
      nom: ['', [Validators.required]],
      actifId: [this.currentActifId, [Validators.required]],
  
    });
    this.menaceForm = this.formBuilder.group({
      nom: ['', [Validators.required]],
     
  
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

loadVulnerabilites() {
  this.vulnerabiliteService.getVulnerabiliteByActif(this.currentActifId).subscribe((data) => {
    this.vulnerabilites=data
    console.log('vulnerabilites of actif',data)
 
  }); 
}

checkVulnerabilite(idVulnerabilite: any) {
  this.checkedVulnerabiliteId=idVulnerabilite;
  console.log(idVulnerabilite)
  this.addMenaceModal?.show()
  }


  saveVulnerabilite() {
    if (this.vulnerabiliteForm.valid) {
      const registerData = new FormData();
      registerData.append('nom', this.vulnerabiliteForm.value.nom);
      registerData.append('actifId', this.vulnerabiliteForm.value.actifId);

   
      console.log(registerData)
      this.vulnerabiliteService.addVulnerabilite(registerData).subscribe(
        response => {
          this.vulnerabiliteForm.reset();
          this.loadVulnerabilites();
          this.addVulnerabiliteModal?.hide();
       
        },
        error => {
          if (error.status === 400) {
            let errorMessage = '';
            for (const field in error.error) {
              if (error.error.hasOwnProperty(field)) {
                errorMessage += `./ ${error.error[field]} <br>`;
              }
            }
            this.addVulnerabiliteError = errorMessage.trim();
          } else if (error.status === 409) {
            this.addVulnerabiliteError = error.error;
          } else {
            this.addVulnerabiliteError = 'An unexpected error occurred during registration, try again';
          }
        }
      );
    }

  }
  saveMenace() {
    
    if (this.menaceForm.valid) {
      const registerData = new FormData();
      registerData.append('nom', this.menaceForm.value.nom);
      registerData.append('vulnerabiliteId', this.checkedVulnerabiliteId);

   
      console.log(registerData)
      this.vulnerabiliteService.addMenace(registerData).subscribe(
        response => {
          this.menaceForm.reset();
          this.loadVulnerabilites();
          this.addMenaceModal?.hide();
       
        },
        error => {
          if (error.status === 400) {
            let errorMessage = '';
            for (const field in error.error) {
              if (error.error.hasOwnProperty(field)) {
                errorMessage += `./ ${error.error[field]} <br>`;
              }
            }
            this.addMenaceError = errorMessage.trim();
          } else if (error.status === 409) {
            this.addMenaceError = error.error;
          } else {
            this.addMenaceError = 'An unexpected error occurred during registration, try again';
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
