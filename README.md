# markdown-file-linker Atom Package

**Just d&d file to atom text editor, then link to dropped file is inserted automatically!**

![A screenshot of your package](https://github.com/Kenji-M-iyamoto/atom-markdown-file-linker/blob/cc1791f907a3e976b03165dce043f6ce875623dc/Animation.gif)

###1. Description
 **markdown-file-linker is made to enhance possibility of markdown life**.
 When you use markdown for presentation, meeting minutes, or even just memo,
 you can manage a lot of files and materials with this extention!
 This package performs:
-copy file to particular directory(same name dir as md filename)  
-and then add \<a\> tag link to your markdown file  
when somewhat file(s) is dropped to atom textEditor area.  

###2. Install
- Just install from atom package management.  

###3. Features
  - make directory when directory that have same name as md filename doesn't exists
  - copy dropped file to above Directory
  - when file that same name as dropped file existed in above directory, confirm overwrite or not
  - insert \<a\> link text at the current cursor position of atom texteditor

###4. Notes
   - some browser restrict to open local file therefore in such case created link doesn't work properly.
     when you face to above, check browser's option.
   - can use package of "markdown preview" in atom extention, refer to below information
   - **Markdown Preview Enhanced**: link works correct
   - **Markdown Preview**: doesn't work even though "Allow Unsafe Protocols" option is checked

###5. History
**[version 1.0.0]**  
  - release prototype
