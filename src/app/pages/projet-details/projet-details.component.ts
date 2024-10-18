import { Component, ViewChild } from '@angular/core';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { DecimalPipe } from '@angular/common';
import { reviewsModel } from '../ecommerce/product-details/product-details.model';
import { ProjetService } from 'src/app/core/services/projet.service';
import { ActivatedRoute } from '@angular/router';
import { RiskMatrixCell } from './RiskMatrixCell';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-projet-details',
  templateUrl: './projet-details.component.html',
  styleUrls: ['./projet-details.component.scss'],
  providers: [DecimalPipe]
})
export class ProjetDetailsComponent {
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  reviewForm!: UntypedFormGroup;
  productdetail: any;
  reviewData!: reviewsModel[];
  actifsInProject!: any[];
  actifsNotInProject!: any[];
  selectedActifs: any[] = [];
  submitted: boolean = false;
  deleteId: any;
  currentProjetId!: string | null;
  nbrActifInProject!: number;
  projectRisk!: any;
  matrixCells: RiskMatrixCell[] = [];
  files: File[] = [];

  @ViewChild('AssigningActif', { static: false }) AssigningActif?: ModalDirective;
  @ViewChild('removeItemModal', { static: false }) removeItemModal?: ModalDirective;
  @ViewChild('slickModal') slickModal!: SlickCarouselComponent;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private projetService: ProjetService,
    private route: ActivatedRoute,
    private toastr: ToastrService 
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Projet' },
      { label: 'Configuration', active: true }
    ];

    this.reviewForm = this.formBuilder.group({
      _id: [''],
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
      rate: ['', [Validators.required]],
      img: ['']
    });

    this.getCurrentProjectId();
    this.loadActifsInProject();
    this.loadActifsNotInProject();
    this.loadProjetRisque();
    this.loadRiskMatrix();
  }

  slideConfig = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  slidesConfig = {
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
  };

  slickChange(event: any) {
    const swiper = document.querySelectorAll('.swiperlist');
  }

  slidePreview(id: any, event: any) {
    const swiper = document.querySelectorAll('.swiperlist');
    swiper.forEach((el: any) => {
      el.classList.remove('swiper-slide-thumb-active');
    });
    event.target.closest('.swiperlist').classList.add('swiper-slide-thumb-active');
    this.slickModal.slickGoTo(id);
  }

  public dropzoneConfig: DropzoneConfigInterface = {
    clickable: true,
    addRemoveLinks: true,
    previewsContainer: false,
  };

  getCurrentProjectId() {
    this.route.paramMap.subscribe(params => {
      this.currentProjetId = params.get('id');
    });
  }

  loadActifsInProject() {
    this.projetService.getActifsInProject(this.currentProjetId).subscribe((data) => {
      console.log("actifs In Project", data);
      this.actifsInProject = data;
      this.nbrActifInProject = data.length;
    });
  }

  loadActifsNotInProject() {
    this.projetService.getActifsNotInProject(this.currentProjetId).subscribe((data) => {
      console.log("actifs Not In Project", data);
      this.actifsNotInProject = data;
    });
  }

  openAssignActifModal() {
    this.loadActifsNotInProject();
    this.AssigningActif?.show();
  }

  toggleSelection(actif: any) {
    actif.selected = !actif.selected;
    if (actif.selected) {
      this.selectedActifs.push(actif);
    } else {
      this.selectedActifs = this.selectedActifs.filter(a => a.id !== actif.id);
    }
  }

  assignActifsToProject() {
    if (this.selectedActifs.length > 0) {
      const selectedActifIds = this.selectedActifs.map(actif => actif.id);
      
      console.log('Assigning the following actifs:', selectedActifIds);
      this.projetService.assignActifsToProject(selectedActifIds, this.currentProjetId).subscribe(
        response => {
          console.log('Actifs assigned successfully', response);
          this.selectedActifs.forEach(actif => actif.selected = false);
          this.selectedActifs = [];
          this.loadActifsInProject();
          this.loadProjetRisque();
          this.loadRiskMatrix();
          this.AssigningActif?.hide();
          this.loadActifsNotInProject();
          this.toastr.success('Actifs assignés avec succès!', 'Succès'); // Success toast
        },
        error => {
          console.error('Error assigning actifs', error);
          this.toastr.error('Erreur lors de l\'assignation des actifs, veuillez réessayer.', 'Erreur'); // Error toast
        }
      );
    } else {
      console.log('No actifs selected.');
      this.toastr.warning('Aucun actif sélectionné.', 'Avertissement'); // Warning toast
    }
  }

  loadProjetRisque(): void {
    const projetId = this.currentProjetId; 
    this.projetService.getProjetRisque(projetId).subscribe(
      (risk) => {
        this.projectRisk = risk;
        console.log('Project Risk:', risk);
      },
      (error) => {
        console.error('Error loading project risk:', error);
      }
    );
  }

  loadRiskMatrix(): void {
    this.projetService.getRiskMatrix(this.currentProjetId).subscribe(
      (data: RiskMatrixCell[]) => {
        console.log("RiskMatrixCell ", data);
        this.matrixCells = data;
      },
      (error) => {console.error('Error fetching risk matrix', error)}
    );
  }

  getMatrixCellCount(likelihood: number, impact: number): number {
    const cell = this.matrixCells.find(c => c.likelihood === likelihood && c.impact === impact);
    return cell ? cell.count : 0;
  }

  getCellColor(potential: number, impact: number): string {
    const greenCells = [
      [1, 1], [2, 1], [3, 1], [4, 1],
      [1, 2], [2, 2], [3, 2],
      [1, 3], [2, 3],
      [1, 4]
    ];

    const warningCells = [
      [1, 5], [1, 6],
      [2, 4], [2, 5], [2, 6],
      [3, 3], [3, 4], [3, 5],
      [4, 2], [4, 3], [4, 4],
      [5, 1], [5, 2], [5, 3],
      [6, 1], [6, 2]
    ];

    if (greenCells.some(cell => cell[0] === potential && cell[1] === impact)) {
      return 'green'; 
    } else if (warningCells.some(cell => cell[0] === potential && cell[1] === impact)) {
      return 'yellow'; 
    } else {
      return 'red'; 
    }
  }

  // Delete Review
  removeReview(id: any) {
    this.deleteId = id;
    this.removeItemModal?.show();
  }

  DeleteReview() {
    this.projetService.removeActifFromProject(this.currentProjetId, this.deleteId).subscribe(
      response => {
        console.log('Actifs removed successfully', response);
        this.loadActifsInProject();
        this.loadRiskMatrix();
        this.loadProjetRisque();
        this.removeItemModal?.hide();
        this.toastr.success('Actif supprimé avec succès!', 'Succès'); 
      },
      error => {
        console.error('Error removing actif', error);
        this.toastr.error('Erreur lors de la suppression de l\'actif, veuillez réessayer.', 'Erreur'); 
      }
    );
  }
}
