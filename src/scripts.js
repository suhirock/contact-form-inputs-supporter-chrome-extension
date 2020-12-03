
/**
 * Mail Tester Class
 * 
 */
class MT {
    /**
     * @private
     * @var object forms / 
     */
    static forms;

    /**
     * @private
     * @var object target_form
     */
    static focus_event;

    /**
     * @private
     * @var NodeItem target_form
     */
    static target_form;

    /**
     * Constructor
     */
    constructor(){
        this.forms = null
        this.focus_event = null
        this.target_form = null
    }
    
    /**
     * Get forms
     */
    static getForms(){
        return this.forms
    }

    /**
     * Get target_form
     */
    static getTargetForm(){
        return this.target_form
    }

    /**
     * Set target_form
     * 
     * @param nodeDocument form
     */
    static setTargetForm(form){
        this.target_form = form
    }

    /**
     * Collect form object
     */
    static collectPageForms(){
        this.forms = document.querySelectorAll('form')
    }

    /**
     * Focus form action
     * 
     * @param string type / collect or insert
     */
    static focusForms(focusType){
        const forms = [...this.forms]
        const self = this
        this.focus_event = {type:focusType, handleEvent:this.focusFormClick};
        forms.map(f => {
            f.style.border = "2px dashed red"
            f.addEventListener('mouseenter',this.focusFormMouseOver)
            f.addEventListener('mouseleave',this.focusFormMouseLeave)
            f.addEventListener('click',this.focus_event)
        })
    }
    // Focus form action mouse over
    static focusFormMouseOver() {
        this.style.backgroundColor = '#F00';
    }
    // Focus form action mouse leave
    static focusFormMouseLeave() {
        this.style.backgroundColor = '';
    }
    // Focus form action click
    static focusFormClick(e) {
        const forms = [...MT.forms]
        MT.target_form = e.currentTarget
        forms.map(f => {
            f.removeEventListener('mouseenter',MT.focusFormMouseOver)
            f.removeEventListener('mouseleave',MT.focusFormMouseLeave)
            f.removeEventListener('click',MT.focus_event)
            f.style.border = ""
            f.style.backgroundColor = ""
        })
        if(this.type === 'collect'){
            MT.collectPageInputs()
        } else if(this.type === 'insert') {
            MT.insertPageInputs()
        }
    }

    /**
     * Single form action
     * @param string type 
     */
    static singleForm(type) {
        this.target_form = document.querySelector('form')
        if(type === 'collect'){
            this.collectPageInputs()
        } else if(type === 'insert') {
            this.insertPageInputs()
        }
    }

    /**
     * Collect page form values
     */
    static collectPageInputs() {
        
        // formが存在しなければfalseを返す
        if(! this.target_form){
            alert('This page have not from element.')
            return false
        }

        // vars
        const http = location.href
        
        // フォームのデータを取得
        const form_elements = this.target_form.elements

        // valueとkeyを整理
        let temp_form_values = {};
        for(let i=0;i<form_elements.length;i++){
            let form_value = null
            if(! form_elements[i].name){
                continue
            }
            if(form_elements[i].tagName === 'BUTTON'){
                continue
            } else if(form_elements[i].tagName === 'INPUT'){
                if(form_elements[i].type === 'hidden' || form_elements[i].type === 'submit'){
                    continue
                }
                if(form_elements[i].type === 'checkbox' || form_elements[i].type === 'radio'){
                    if(form_elements[i].checked){
                        form_value = form_elements[i].value
                    } else {
                        continue
                    }
                } else {
                    form_value = form_elements[i].value
                }
            } else {
                form_value = form_elements[i].value
            }
            temp_form_values[form_elements[i].name] = form_value
        }

        let temp = {}
        temp[http] = temp_form_values;

        // Insert storage
        chrome.storage.local.set(temp, () => {
           alert('フォームの入力値を取得しました')
           MT.forms = null
        });
    }

    /**
     * Set to form db data
     */
    static insertPageInputs() {

        // formが存在しなければfalseを返す
        if(! this.target_form){
            alert('This page have not from element.')
            return false
        }
        
        // vars
        const http = location.href

        // form element get
        const form_elements = this.target_form.elements

        // Get storage data
        chrome.storage.local.get([http], function(result) {

            const data = result[http]

            for(let i=0;i<form_elements.length;i++){
                if(! data[form_elements[i].name]){
                    continue
                } else {
                    if(form_elements[i].tagName === 'INPUT'){
                    // INPUT
                        if(form_elements[i].type === 'checkbox' || form_elements[i].type === 'radio'){
                            if(form_elements[i].value === data[form_elements[i].name]){
                                form_elements[i].checked = true
                            }
                        } else {
                            form_elements[i].value = data[form_elements[i].name]
                        }
                    } else {
                    // SELECT
                        form_elements[i].value = data[form_elements[i].name]
                    }
                }
            }
            
            alert('フォームにセットしました')
            MT.forms = null
        })

    }

    /**
     * checkValues
     */
    static checkValues() {
        const http = location.href

        chrome.storage.local.get([http], function(result) {
            if(result[http]){
                MT.createModal()
                    .then(MT.createModalInner)
                    .then(MT.storageDataShow.bind(this, result[http]))
            } else {
                alert('データがありません')
            }
        })
    }
    // create modal
    static createModal(){
        return new Promise((resolve) => {
            const elm = document.createElement('div')
            elm.classList.add('mail-tester__modal')
            elm.style.width = '100vw'
            elm.style.height = '100vh'
            elm.style.position = 'fixed'
            elm.style.padding = '5%'
            elm.style.zIndex = 99998
            elm.style.backgroundColor = 'rgba(0,0,0,.3)'
            elm.style.top = 0
            elm.style.left = 0
            document.querySelector('body').appendChild(elm)
            resolve()
        })
    }
    // create modal inner
    static createModalInner(){
        return new Promise((resolve) => {
            const elm = document.createElement('div')
            elm.classList.add('mail-tester__modal__inner')
            elm.style.zIndex = 99999
            elm.style.backgroundColor = 'white'
            elm.style.padding = '1%'
            elm.innerHTML = '<div class="mail-tester__button-area">'
                +'<button id="mail-tester__dataClear">データをクリア</button>'
                +'<button id="mail-tester__close">閉じる</button>'
                +'</div>'
                +'<div class="mail-tester__modal__inner__data"><pre></pre></div>'
            document.querySelector('.mail-tester__modal').appendChild(elm)
            document.querySelector('#mail-tester__dataClear').onclick = MT.clearFormValues
            document.querySelector('#mail-tester__close').onclick = MT.closeModal
            resolve()
        })
    }
    // storage
    static storageDataShow(data){
        return new Promise((resolve,reject) => {
            const pre = document.querySelector('.mail-tester__modal__inner__data pre')
            pre.style.lineHeight = 1.5
            pre.style.display = 'block'
            pre.style.marginTop = '20px'
            pre.innerHTML = JSON.stringify(data,null,"\t");
            resolve()
        })
    }
    // Clear form values
    static clearFormValues() {
        const http = location.href
        if(window.confirm('データをクリアしてもよろしいですか？')){
            chrome.storage.local.remove(http, function() {
                alert('このページのデータをクリアしました')
                MT.closeModal()
            })
        }
    }
    // Check value modal close
    static closeModal() {
        document.querySelector('.mail-tester__modal').remove()
    }
}

/**
 * popup.htmlからのリクエストを取得して返す
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    const http = location.href;

    if(request.actionKey === 'getFormValues'){
        MT.collectPageForms()
        if(1 > MT.getForms().length){
           alert('フォーム要素がありません')
           return false
        } else if(1 < MT.getForms().length){
            MT.focusForms('collect')
        } else {
            MT.singleForm('collect')
        }
        sendResponse('close')
    } 
    else if(request.actionKey === 'checkFormValues') {
        // 状態をページ上で出力する処理
        // 確認して削除できるようにする
        // 出力した内容に「とじる」と「クリア」を追加
        MT.checkValues()
        sendResponse('close')
    } 
    else if(request.actionKey === 'setFormValues') {
        MT.collectPageForms()
        if(1 > MT.getForms().length){
            alert('フォーム要素がありません')
            return false
        } else if(1 < MT.getForms().length){
            MT.focusForms('insert')
        } else {
            MT.singleForm('insert')
        }
        sendResponse('close')
    }
})


