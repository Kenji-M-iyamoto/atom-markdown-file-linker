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
                                notification=atom.notifications.addWarning('file already exists, overwrite?',
                                     {dismissable:true,buttons:[{text:"yes"
                                                                              ,onDidClick:function(){
                                                                                  fs.copyFileSync(files[i].path,copyTo+"\\"+dirName+"\\"+fileName);
                                                                                  notification.dismiss();
                                                                                  atom.notifications.addSuccess("done!");
                                                                                }
                                                                              },
                                                                             {text:"no"
                                                                              ,onDidClick:function(){
                                                                                    notification.dismiss();
                                                                              }
                                                                            }]
                                    });
                        }else{
                            notification=atom.notifications.addWarning('unexpected error occured. abort.');
                        }
                        return
                   }finally{
                     //textEditor.insertText('<a href="file://'+copyTo+"\\"+dirName+"\\"+fileName+'">link</a>');
                     textEditor.insertText('<a href="'+dirName+"\\"+fileName+'">link</a>');
                     textEditor.cursors[0].moveLeft("link</a>".length);
                     textEditor.selections[0].selectRight("link".length);
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
