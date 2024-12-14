"use client"
import { useState, useEffect } from 'react'
import Card from '../../../../components/card';
import { useParams } from 'next/navigation'
// Komentar
import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';
import ConfigDialog from '../../../../components/ConfirmDialog'

export default function Blogsbyid(){
    // Komentar
    const editorRef = useRef(null);
    const [modal, setModal] = useState(false)
    const [modalTitle, setModalTitle] = useState("")
    const [modalMessage, setModalMessage] = useState("")
    // Komentar end
    const params = useParams();
    const [data, setData] = useState(null)
    const [isLoading, setLoading] = useState(true)
     // Komentar
    const [datakomen, setDataKomen] = useState({
        nama:'',
        email:'',
        komentar:'',
        blogId: params.id
    });
    const [isLoadingKomentar, setLoadingKomentar]= useState(false)
    const [dataKomentar, setDataKomentar] = useState([])
    const clearData = ()=>{
        setDataKomen({
            nama:'',
            email:'',
            komentar:'',
            blogId: params.id
        })
    } 
    const inputHandler= (e) =>{
        setDataKomen({...datakomen, [e.target.name]: e.target.value })
    }
    // End Komentar

    const onFetchBlogs=async()=>{
        try{
            setLoading(true)
            let res = await fetch(`/api/blogs/${params.id}`)
            let data = await res.json()
            setData(data.data)
            setLoading(false)
        }catch(err){
            console.log('err', err)
            setData(null)
            setLoading(false)
        }
    }

    const onFetchKomentar=async()=>{
        try{
            setLoadingKomentar(true)
            let res = await fetch(`/api/komentar/${params.id}`)
            let data = await res.json()
            setDataKomentar(data.data)
            setLoadingKomentar(false)
        }catch(err){
            console.log('err', err)
            setDataKomentar([])
            setLoadingKomentar(false)
        }
    }

    // Komentar
    const onCancel=()=>{
        setModal(false)
        setModalTitle('')
        setModalMessage('')
        clearData()
    }
    // end Komentar

    async function onSubmitData() {
        try{
            if (editorRef.current) {
                const body = datakomen
                body.komentar = editorRef.current.getContent();

                let res = await fetch('/api/komentar', {
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


    useEffect(()=>{
        onFetchBlogs()
        onFetchKomentar()
    },[])

    if(isLoading) return (<>Loading...</>)

    return (
        <>
            <div className='margin-0 mx-auto w-2/3'>
                <h2 className="text-center text-[32px] font-bold w-full">{data.title}</h2>
                <div className='mb-40 mt-10  ' dangerouslySetInnerHTML={{ __html: data.content }}/>
            </div>

            {/* Start Komentar */}
            <Card title="Tuliskan komentar">
            <div className="w-full my-5">
                <label>Nama</label>
                    <input 
                        name='nama'
                        value={datakomen.nama}
                        onChange={inputHandler}
                        type="text" 
                        className="w-full border my-input-text"/>
            </div>

            <div className="w-full my-2">
                <label>Email</label>
                    <input 
                        name='email'
                        value={datakomen.email}
                        onChange={inputHandler}
                        className="w-full border my-input-text"/>
            </div>

            <div className="w-full my-2">
                <label>Komentar</label>
                <Editor
                    id='komentar'
                    apiKey='hz9os6h0p1826jcqknks4q1fm8yl9khctaa7nmexkf0rnx2e'
                    onInit={(_evt, editor) => editorRef.current = editor}
                    initialValue={datakomen.komentar}
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
                    Kirim
                </span>
            </button>
        </Card>
        
        {
            dataKomentar.map( (komen,idx) => <Card className="mt-5" key={idx} title={komen.nama}>
                <div  dangerouslySetInnerHTML={{ __html: komen.komentar }} />
            </Card> )
        }
        

        <ConfigDialog  
            onOkOny={()=>onCancel()} 
            showDialog={modal}
            title={modalTitle}
            message={modalMessage}
            onCancel={()=>onCancel()} 
            onOk={()=>onCancel()} 
            isOkOnly={true} />
        {/* End Komentar */}
        </>
    );
}