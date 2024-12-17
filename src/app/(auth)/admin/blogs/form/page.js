'use client'
import Card from '../../../../../components/card';
import ConfigDialog from '../../../../../components/ConfirmDialog'
import { useState } from 'react'
import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function AdminBlogsForm() {
    const editorRef = useRef(null);
    const [modal, setModal] = useState(false)
    const [modalTitle, setModalTitle] = useState("")
    const [modalMessage, setModalMessage] = useState("")
    const [data, setData] = useState({
        title:'',
        subTitle:'',
        content:'',
        kategori:'',
    });

    const clearData = ()=>{
        setData({
            title:'',
            subTitle:'',
            content:'',
            kategori:'',
        })
    }
    const kategori = [
        {label:'React Js', value:'React Js'},
        {label:'React Native', value:'React Native'},
        {label:'Vlue.js', value:'Vlue.js'},
        {label:'Web Pemograman', value:'Web Pemograman'},
        {label:'php programming', value:'php programming'},
      ]
    const inputHandler= (e) =>{
        setData({...data, [e.target.name]: e.target.value })
    }

    const onCancel=()=>{
        setModal(false)
        setModalTitle('')
        setModalMessage('')
        clearData()
    }

    async function onSubmitData() {
        try{
            if (editorRef.current) {
                const body = data
                body.content = editorRef.current.getContent();

                let res = await fetch('/api/blogs', {
                    method:'POST',
                    body: JSON.stringify(body),
                })

                let resData = await res.json()
                if(!resData.data){
                throw Error(resData.message)
                }
                setModal(true)
                setModalTitle('Info')
                setModalMessage(resData.message)
            }
        }catch(err){
          console.error("ERR", err.message)
          setModal(true)
          setModalTitle('Err')
          setModalMessage(err.message)
        }
      }

    return (
    <>

        <Card title="Blogs Form">
            <div className="w-full my-2">
                <label>Title</label>
                    <input 
                        name='title'
                        value={data.title}
                        onChange={inputHandler}
                        type="text" 
                        className="w-full border my-input-text"/>
            </div>

            <div className="w-full my-2">
                <label>Sub Title</label>
                    <input 
                        name='subTitle'
                        value={data.subTitle}
                        onChange={inputHandler}
                        className="w-full border my-input-text"/>
            </div>
            <div className="w-full my-2">
            <label>kategori</label>
            <select  
            name='kategori' 
            value={data.kategori}  // Tambahkan value untuk menampilkan data yang dipilih
            onChange={inputHandler}
            className="w-full border my-input-text">
            {
            kategori.map((item, key) => 
            <option key={key} value={item.value}>{item.label}</option>
            )
            }
</select>

        </div>
            <div className="w-full my-2">
                <label>Content</label>
                <Editor
                    id='content'
                    apiKey='cdb9kl0m02wk2wu5ce13qh55bt38qycdnc2c4vqclccpr9n4'
                    onInit={(_evt, editor) => editorRef.current = editor}
                    initialValue={data.content}
                    init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }}
                />
            </div>

            <button  className="btn-primary" onClick={onSubmitData}>
                <span className="relative text-sm font-semibold text-white">
                    Save Data
                </span>
            </button>
        </Card>

        <ConfigDialog  
            onOkOny={()=>onCancel()} 
            showDialog={modal}
            title={modalTitle}
            message={modalMessage}
            onCancel={()=>onCancel()} 
            onOk={()=>onCancel()} 
            isOkOnly={true} />
    </>
    )
}