import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AccountService} from '../../services/account.service';
import {Account} from '../../models/account';
import {CategoryService} from '../../services/category.service';
import {Category} from '../../models/category';
import {FixedCost} from '../../models/fixed-cost';
import {FixedCostService} from '../../services/fixed-cost.service';
import {TransactionService} from '../../services/transaction.service';
import {Transaction} from '../../models/transaction';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-fixed-cost-form',
  templateUrl: './fixed-cost-form.component.html',
  styleUrl: './fixed-cost-form.component.css'
})
export class FixedCostFormComponent implements OnDestroy {
  @Input() selectedFixedCost?: FixedCost;
  @Output() closeEvent = new EventEmitter<void>();
  @Output() fixedCostEvent = new EventEmitter<FixedCost>();
  today: string;
  fixedCostForm: FormGroup;
  account?: Account;
  categoryList: Category[] = [];
  destroy = new Subject<void>();
  newCategory: boolean = false;
  transactionType?: string;


  constructor(private fb: FormBuilder, private accountService: AccountService, private categoryService: CategoryService, private fixedCostService: FixedCostService, private transactionService: TransactionService) {
    this.today = new Date().toISOString().split('T')[0];
    this.fixedCostForm = this.fb.group(
      {
        id: [],
        amount: ["", Validators.required],
        start: ["", Validators.required],
        description: [""],
        category: ["", Validators.required],
        account: [this.account],
        generatedTransactions: [[]]
      }
    )
    accountService.account$.pipe(takeUntil(this.destroy)).subscribe(data => {
      this.account = data;
      this.fixedCostForm.get("account")?.patchValue(this.account);
    });
  }

  ngOnInit() {
    this.initCategories();
  }

  ngOnChanges() {
    this.fillFormWithDefaultValues();
  }

  private fillFormWithDefaultValues() {
    if (!this.selectedFixedCost) {
      return;
    }
    if (this.categoryList.length === 0) {
      return;
    }
    const category = this.categoryList?.find(c => c.id === this.selectedFixedCost?.category.id);
    this.fixedCostForm = this.fb.group(
      {
        id: [this.selectedFixedCost.id],
        amount: [Math.abs(this.selectedFixedCost.amount), Validators.required],
        start: [this.selectedFixedCost.start, Validators.required],
        description: [this.selectedFixedCost.description],
        category: [category, Validators.required],
        account: [this.selectedFixedCost.account],
        generatedTransactions: [this.selectedFixedCost.generatedTransactions]
      }
    )
    if (this.selectedFixedCost) {
      if (this.selectedFixedCost.amount > 0) {
        this.transactionType = "1";
      } else if (this.selectedFixedCost.amount < 0) {
        this.transactionType = "-1";
      }
    }
  }


  createFixedCost(): void {
    const fixedCost: FixedCost = this.fixedCostForm.value;
    if (this.transactionType) {
      fixedCost.amount = fixedCost.amount * parseInt(this.transactionType);
    }
    if ((new Date(fixedCost.start).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0) && !this.selectedFixedCost)) {
      let transaction: Transaction = {
        amount: fixedCost.amount,
        account: fixedCost.account,
        category: fixedCost.category,
        description: fixedCost.description,
        timestamp: new Date(),
        isFixedCost: true
      }
      this.transactionService.addTransaction(transaction).subscribe(data => {
        transaction = data;
        fixedCost.generatedTransactions.push(transaction);
        this.saveFixedCost(fixedCost);
      });
    } else {
      this.saveFixedCost(fixedCost);
    }
  }

  saveFixedCost(fixedCost: FixedCost): void {
    if (fixedCost.id === null) {
      this.fixedCostService.addFixedCost(fixedCost).subscribe((data) => {
        this.accountService.refetchSelectedAccount();
        this.closeForm();
      });
    } else {
      this.fixedCostService.modifyFixedCost(fixedCost).subscribe(data => {
        this.updateFixedCost(data);
        this.closeForm();
        this.accountService.refetchSelectedAccount();
      })
    }
  }


  updateFixedCost(fixedCost: FixedCost) {
    this.fixedCostEvent.emit(fixedCost);
  }

  closeForm(): void {
    this.closeEvent.emit();
  }

  private initCategories() {
    this.categoryService.getCategories().subscribe(categories => {
      this.categoryList = categories;
      this.fillFormWithDefaultValues();
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        setTimeout(() => 'Loading ...', 4000);
        this.categoryList = data;
      },
      error: (error) => {
        console.log('error loading categories: ', error);
      },
    });
  }

  deleteSelectedCategory() {
    const selectedCategory =
      this.fixedCostForm.get('category')?.value;
    if (selectedCategory) {
      this.categoryService.deleteCategory(selectedCategory.id).subscribe({
        next: () => {
          console.log('Delete Category successfully');
          this.loadCategories();
          this.fixedCostForm.get('category')?.setValue('');
        },
        error: (error) => {
          console.log('Can not delete Category: ', error);
          alert('Cannot delete Category while it is still in use');
        },
      });
    }
  }

  return(boolean: boolean) {
    this.newCategory = boolean;
    this.loadCategories();
    this.fixedCostForm.get('category')?.setValue('');
  }


  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
