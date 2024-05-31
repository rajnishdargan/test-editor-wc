import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { questionSetEditorConfig } from './data';
import ClassicEditor from '@project-sunbird/ckeditor-build-classic';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit, OnInit {
  @ViewChild('editor') public editorRef: ElementRef;
  @ViewChild('questionsetEditor') inQuiryEditor!: ElementRef;
  private toolbarItems = ['undo', 'redo', 'bold', 'italic', 'blockQuote', 'heading', 'link', 'numberedList', 'bulletedList', 'fontFamily',
    'fontSize', 'fontColor', 'fontBackgroundColor', 'underline', 'subscript', 'superscript', 'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells'];
  public editorInstance: any;
  public ckEditorLib: any;

  ngOnInit(): void {
    this.ckEditorLib = {
      classicEditor: ClassicEditor
    }
  }

  ngAfterViewInit() {
    this.loadCKEditor();
    const editorConfig = questionSetEditorConfig;
    const questionsetEditorElement = document.createElement('lib-questionset-editor');
    questionsetEditorElement.setAttribute('editor-config', JSON.stringify(editorConfig));
    (questionsetEditorElement as any).ckEditorLib = this.ckEditorLib;
    questionsetEditorElement.addEventListener('editorEmitter', (event) => {
      console.log("On editorEvent", event);
    });

    this.inQuiryEditor.nativeElement.append(questionsetEditorElement);
  }

  loadCKEditor() {
    this.ckEditorLib.classicEditor.create(this.editorRef.nativeElement, {
      toolbar: this.toolbarItems
    })
      .then(editor => {
        this.editorInstance = editor;
        this.editorInstance.setData('hello');
      })
      .catch(err => { console.error(err); });
  }

}