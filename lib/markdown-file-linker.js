'use babel';

import { CompositeDisposable } from 'atom';
import { Directory } from 'atom';
import {File} from 'atom';
import fs from 'fs';
import path from 'path';

export default {

  //markdownFileLinkerView: null,
  //modalPanel: null,
  subscriptions: null,

  activate(state) {
       this.subscriptions = new CompositeDisposable();
       atom.workspace.observeTextEditors(function(textEditor) {
            textEditorElement = atom.views.getView(textEditor);
            textEditorElement.addEventListener('drop', function(e){
               e.preventDefault();
               e.stopPropagation();
               filePath = textEditor.getPath();
               if(!filePath){
                  atom.notifications.addWarning('please save markdown file at first!');
                  return;
               }
               ds=new Directory(filePath);
               copyTo=ds.getParent().path;
               dirName=path.basename(filePath).replace(path.extname(filePath),"");
               dsForConfirm=new Directory(copyTo+"/"+dirName+"/");
               if(!dsForConfirm.existsSync()){
                   try{
                      fs.mkdirSync(copyTo+"/"+dirName);
                  }catch(err){
                      atom.notifications.addError('cannot make directory. abort');
                      return;
                  }
               }
               files = e.dataTransfer.files;
               for(i=0;i<files.length;i++){
                   ds=new Directory(files[i].path);
                   fileName=files[i].path.replace(ds.getParent().path+"\\","");
                   try{
                     fs.copyFileSync(files[i].path,copyTo+"\\"+dirName+"\\"+fileName,fs.constants.COPYFILE_EXCL);
                   }catch(err){
                       if(err.code=="EEXIST"){
                              rc=atom.confirm({message:fileName+' already exists, overwrite?',buttons:["yes","no","cancel all"]});
                              if(rc==0){
                                fs.copyFileSync(files[i].path,copyTo+"\\"+dirName+"\\"+fileName);
                                atom.notifications.addSuccess(fileName+": overwritten");
                              }else if(rc==1){
                                atom.notifications.addWarning(fileName+": no change");
                              }else if(rc==2){
                                atom.notifications.addWarning("canceled all operations after file "+fileName);
                                return;
                              }
                      }else{
                          notification=atom.notifications.addWarning('unexpected error occured. abort.');
                      }
                   }finally{
                  }
                  textEditor.insertText('<a href="'+dirName+"\\"+fileName+'">link</a>');
                  if(i>=files.length-1){
                    textEditor.cursors[0].moveLeft("link</a>".length);
                    textEditor.selections[0].selectRight("link".length);
                  }else{
                    textEditor.insertNewlineBelow();
                  }
             }
          })
      })
  },

  deactivate() {
    //this.modalPanel.destroy();
    this.subscriptions.dispose();
  },

/*  serialize() {
    return {
      //markdownFileLinkerViewState: this.markdownFileLinkerView.serialize()
    };
  },*/

  toggle() {
    console.log('MarkdownFileLinker was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
