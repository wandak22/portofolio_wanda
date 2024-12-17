"use client"
import { useRouter, useParams } from 'next/navigation';
import Card from '../../../../../components/card';
import { useEffect, useState, useRef } from 'react';
import ConfigDialog from '../../../../../components/ConfirmDialog';
import { Editor } from '@tinymce/tinymce-react';

export default function EditBlogs() {
    const router = useRouter();
    const editorRef = useRef(null);
    const params = useParams();
    const [modal, setModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [isOkOnly, setIsOkOnly] = useState(true);
    const [data, setData] = useState({
        title: '',
        subTitle: '',
        content: '',
        _id: '',
        kategori:'',
    });
    const kategori = [
        {label:'React Js', value:'React Js'},
        {label:'React Native', value:'React Native'},
        {label:'Vlue.js', value:'Vlue.js'},
        {label:'Web Pemograman', value:'Web Pemograman'},
      ]
    // const [categories, setCategories] = useState([]); // State for category options

    // const fetchCategories = async () => {
    //     try {
    //         const res = await fetch('/api/blogs'); // Assume endpoint for fetching categories exists
    //         const categoryData = await res.json();
    //         // setCategories(categoryData.data || []);
    //     } catch (err) {
    //         console.error("Error fetching categories:", err.message);
    //     }
    // };

    const fetchDataById = async () => {
        try {
            const res = await fetch(`/api/blogs/${params.id}`);
            let responseData = await res.json();
            setData(responseData.data);
        } catch (err) {
            console.error("ERR", err.message);
            setModal(true);
            setModalTitle('Error');
            setModalMessage(err.message);
        }
    };

    const onCancel = () => {
        setModal(false);
    };

    const onOkOnly = () => {
        setModal(false);
        router.push('/admin/blogs');
    };

    const inputHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const onSubmitData = async () => {
        try {
            if (editorRef.current) {
                const body = { ...data };
                body.content = editorRef.current.getContent();

                let res = await fetch(`/api/blogs/${data._id}`, {
                    method: 'PUT',
                    // headers: {
                    //     'Content-Type': 'application/json'
                    // },
                    body: JSON.stringify(body),
                });

                let resData = await res.json();
                if (!res.ok) {
                    throw new Error(resData.message);
                }

                setModal(true);
                setModalTitle('Info');
                setModalMessage(resData.message);
            }
        } catch (err) {
            console.error("ERR", err.message);
            setModal(true);
            setModalTitle('Error');
            setModalMessage(err.message);
        }
    };

    useEffect(() => {
        fetchDataById();
        // fetchCategories();
    }, []);

    return (
        <>
            <Card title="Blogs Edit Form">
                <div className="w-full my-2">
                    <label>Title</label>
                    <input
                        name='title'
                        value={data.title}
                        onChange={inputHandler}
                        type="text"
                        className="w-full border my-input-text" />
                </div>

                <div className="w-full my-2">
                    <label>Sub Title</label>
                    <input
                        name='subTitle'
                        value={data.subTitle}
                        onChange={inputHandler}
                        className="w-full border my-input-text" />
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

                <button className="btn-primary" onClick={onSubmitData}>
                    <span className="relative text-sm font-semibold text-white">
                        Save Data
                    </span>
                </button>
            </Card>

            <ConfigDialog
                onOkOny={() => onOkOnly()}
                showDialog={modal}
                title={modalTitle}
                message={modalMessage}
                onCancel={() => onCancel()}
                onOk={() => { }}
                isOkOnly={isOkOnly} />
        </>
    );
}
