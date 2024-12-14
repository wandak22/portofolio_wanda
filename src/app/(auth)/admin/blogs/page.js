'use client'
import Card from '../../../../components/card';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ConfigDialog from '../../../../components/ConfirmDialog'

export default function AdminBlogs() {
    const router = useRouter();
    const [modal, setModal] = useState(false)
    const [modalTitle, setModalTitle] = useState("")
    const [modalMessage, setModalMessage] = useState("")
    const [blogs, setBlogs] = useState([]); // Perbaiki nama state menjadi blogs
    const [filteredBlogs, setFilteredBlogs] = useState([]); // State untuk hasil pencarian
    const [isOkOnly, setIsOkOnly] = useState(true)
    const [deleteId, setDeleteId] = useState(null)
    const [searchTerm, setSearchTerm] = useState(""); // Input pencarian

    const onAddNew = () => {
        router.push('/admin/blogs/form')
    }

    const onConfirmDelete = (id) => {
        setDeleteId(id)
        setIsOkOnly(false)
        setModalTitle('Confirm')
        setModalMessage('Apakah anda yakin ingin menghapus data ini?')
        setModal(true)
    }

    const onCancel = () => {
        setModal(false)
    }

    const onConfirmOk = async () => {
        try {
            const res = await fetch(`/api/blogs/${deleteId}`, { method: 'DELETE' });
            let responseData = await res.json()

            setIsOkOnly(true)
            setModalTitle('Info')
            setModalMessage(responseData.message)
            setModal(true)
            fetchData()
        } catch (err) {
            console.error("ERR", err.message)
            setModal(true)
            setModalTitle('Err')
            setModalMessage(err.message)
        }
    }

    const fetchData = async () => {
        try {
            const res = await fetch('/api/blogs');
            let responseData = await res.json()
            setBlogs(responseData.data); // Menyimpan data blog ke state
            setFilteredBlogs(responseData.data); // Menyimpan data blog yang difilter
        } catch (err) {
            console.error("ERR", err.message)
            setModal(true)
            setModalTitle('Err')
            setModalMessage(err.message)
        }
    }

    const gotoEditPage = (id) => {
        router.push(`/admin/blogs/${id}`)
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault();

        // Filter berdasarkan judul blog
        const results = blogs.filter((item) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredBlogs(results); // Update filteredBlogs dengan hasil pencarian
    };

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <>
            <Card title="manage of Blogs" style="mt-5" showAddBtn onAddNew={onAddNew}>
                <h1 className="text-2xl font-bold mb-4 text-center">search blogs</h1>
                <div className="flex justify-center" >
                <form
                    onSubmit={handleSearchSubmit}
                    className="flex items-center space-x-4 max-w-md mb-6"
                >
                    <input
                        type="text"
                        placeholder="Cari berdasarkan judul..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring focus:ring-indigo-300"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                    >
                        Submit
                    </button>
                </form>
                </div>
                <table className="table-auto w-full">
                    <thead>
                        <tr>
                            <th className='table-head border-blue-gray-100'>No</th>
                            <th className='table-head border-blue-gray-100'>Title</th>
                            <th className='table-head border-blue-gray-100'>Sub Title</th>
                            <th className='table-head border-blue-gray-100'>category blogs</th>
                            <th className='table-head border-blue-gray-100'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBlogs.map((item, key) => {
                            return (
                                <tr key={key} className='border-b border-blue-gray-50 '>
                                    <td className='p-2 text-center'>{key + 1}</td>
                                    <td className='p-2 text-center '>{item.title} </td>
                                    <td className='p-2 text-center'>{item.subTitle} </td>
                                    <td className='p-2 text-center'>{item.kategori} </td>
                                    <td className='p-2 text-center'>
                                        <div className="inline-flex text-[12px]">
                                        <button 
                                            onClick={()=>gotoEditPage(item._id)}
                                            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                                            Edit
                                        </button>
                                        <button 
                                            onClick={()=>onConfirmDelete(item._id)}
                                            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                                            Delete
                                        </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </Card>

            <ConfigDialog
                onOkOny={() => onCancel()}
                showDialog={modal}
                title={modalTitle}
                message={modalMessage}
                onCancel={() => onCancel()}
                onOk={() => onConfirmOk()}
                isOkOnly={isOkOnly} />
        </>
    );
}
