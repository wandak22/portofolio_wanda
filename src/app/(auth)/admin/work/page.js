"use client";
import { useState, useEffect } from 'react';

const ItemCard = ({ label, value }) => {
    return (
        <div className='flex gap-4 bg-white rounded-md m-2 p-2'>
            <div>{label}</div>
            <div>{value}</div>
        </div>
    );
}

export default function Contact() {
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [notifyNetwork, setNotifyNetwork] = useState(false); // State for Switch
    const [title, setTitle] = useState(""); // State for Title input
    const [employmentType, setEmploymentType] = useState(""); // State for Employment Type
    const [company, setCompany] = useState(""); // State for Company input
    const [location, setLocation] = useState(""); // State for Location input
    const [locationType, setLocationType] = useState(""); // State for Employment Type
    const [startDate, setStartDate] = useState(""); // State for Start Date input

    async function onLoadData() {
        setLoading(true);
        try {
            const res = await fetch('/api/contact');
            const data = await res.json();
            setData(data);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        onLoadData();
    }, []);

    return (
        <div className="flex mt-16">
            <div className="md:w-4/4">
                <div className="bg-white p-10 rounded-xl">
                    <h3 className="text-2xl py-2"><b>Add Experience</b></h3>
                    <p>*indicates required</p>
                    <div className='mt-5 mb-5'>
                        <div className="col-md-12 bg-sky-50 p-5">
                            <div className="row">
                                <h4><b>Notify Network</b></h4>
                                <p>Turn on to notify your network of key profile changes (such as new job) and work anniversaries. Updates can take up to 2 hours.</p>
                                <p>Learn more about <a href='/home' className='text-blue-500 cursor-pointer'>sharing profile changes</a></p>
                            </div>
                            {/* Switch */}
                            <div>
                            </div>
                        </div>
                    </div>
                    {/* Title Input */}
                    <div className="col-md-12">
                        <div className="row mb-5">
                            <label>Title *</label>
                            <input 
                                type="text" 
                                className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)} 
                                placeholder="Ex: Retail Sales Manager"
                            />
                        </div>
                        <div className="row mb-5">
                            <label>Employment Type</label>
                            <select 
                                value={employmentType} 
                                onChange={(e) => setEmploymentType(e.target.value)} 
                                className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 mt-3 mb-3 w-full"
                            >
                                <option value="">Please Select</option>
                                <option value="full-time">Full-Time</option>
                                <option value="part-time">Part-Time</option>
                                <option value="contract">Contract</option>
                                <option value="internship">Internship</option>
                                <option value="freelance">Freelance</option>
                            </select>
                            <p>Learn more about <a href="/employment" className="text-blue-400">employment types</a></p>
                        </div>
                        <div className="row mb-5">
                            <label>Company Name *</label>
                            <input 
                                type="text" 
                                className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full" 
                                value={company}
                                onChange={(e) => setCompany(e.target.value)} 
                                placeholder="Ex: Microsoft"
                            />
                        </div>
                        <div className="row mb-5">
                            <label>Location</label>
                            <input 
                                type="text" 
                                className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full" 
                                value={location}
                                onChange={(e) => setLocation(e.target.value)} 
                                placeholder="Ex: London, United Kingdom"
                            />
                        </div>
                        <div className="row mb-5">
                            <label>Location Type</label>
                            <select 
                                value={locationType} 
                                onChange={(e) => setLocationType(e.target.value)} 
                                className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 mt-3 mb-3 w-full"
                            >
                                <option value="">Please Select</option>
                                <option value="remote">Remote</option>
                            </select>
                            <p className="text-gray-400">Pick a location type (ex: remote)</p>
                        </div>
                        <div className="row mb-5">
                            <input 
                                type="checkbox" 
                                className="border-2 border-blue-300 bg-transparent hover:bg-blue-300 focus:outline-none focus:border-blue-500 h-5 w-5" 
                                value="Submit"
                            />
                            <label className="ml-2"> I am currently working in this role</label>
                        </div>
                        <div className="row mb-5">
                            <label>Start Date *</label>
                            <input 
                                type="date" 
                                className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full" 
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)} 
                            />
                        </div>
                        <div className="row mb-5">
                            <label>End Date *</label>
                            <input 
                                type="date" 
                                className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full" 
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)} 
                            />
                        </div>
                    </div>
                </div>
            </div>
            {isLoading && <p>Loading...</p>} {/* Optional loading indication */}
        </div>
    );
}