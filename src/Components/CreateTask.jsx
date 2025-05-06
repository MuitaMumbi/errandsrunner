import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateTask = () => {
    const [formData, setFormData] = useState({
        errand_name: "",
        errand_desc: "",
        errand_cost: "",
        errand_photo: null,
        status: "pending" // Default status
    });
    
    const [loading, setLoading] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null); // State to preview image
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const checkUser = () => {
        if (!user) {
            localStorage.clear();
            navigate("/signin");
        }
    };

    useEffect(() => {
        checkUser();
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({
            ...prev,
            errand_photo: file
        }));
        
        // Preview image
        const reader = new FileReader();
        reader.onloadend = () => {
            setPhotoPreview(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const submitForm = async (e) => {
        e.preventDefault();
        if (!formData.errand_name || !formData.errand_desc || !formData.errand_cost) {
            toast.error("Please fill in all required fields.");
            return;
        }

        try {
            setLoading(true);
            
            const data = new FormData();
            data.append("errand_name", formData.errand_name);
            data.append("errand_desc", formData.errand_desc);
            data.append("errand_cost", formData.errand_cost);
            data.append("creator_id", user.user_id);
            data.append("status", formData.status);
            data.append("errand_photo", formData.errand_photo);
           
            const response = await axios.post(
                "https://Muita.pythonanywhere.com/api/adderrand", 
                data
            );
            
            toast.success(response.data.success || "Task created successfully!");
            setFormData({
                errand_name: "",
                errand_desc: "",
                errand_cost: "",
                errand_photo: null,
                status: "pending"
            });
            setPhotoPreview(null); // Clear photo preview
            
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create task. Please try again.");
            console.error("Error creating task:", error);
        } finally {
            setLoading(false);
        }
    };

    return ( 
        <div className="container py-5">
            <ToastContainer position="top-right" autoClose={5000} />
            
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h2 className="mb-0">Create New Task</h2>
                        </div>
                        
                        <div className="card-body p-4">
                            <form onSubmit={submitForm}>
                                <div className="mb-3">
                                    <label htmlFor="errand_name" className="form-label">
                                        Task Title <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="errand_name"
                                        name="errand_name"
                                        placeholder="Enter task title"
                                        required
                                        className="form-control"
                                        value={formData.errand_name}
                                        onChange={handleChange}
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <label htmlFor="errand_desc" className="form-label">
                                        Description <span className="text-danger">*</span>
                                    </label>
                                    <textarea
                                        id="errand_desc"
                                        name="errand_desc"
                                        placeholder="Enter detailed description"
                                        required
                                        rows="4"
                                        className="form-control"
                                        value={formData.errand_desc}
                                        onChange={handleChange}
                                    />
                                </div>
                                
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="errand_cost" className="form-label">
                                            Budget (KES) <span className="text-danger">*</span>
                                        </label>
                                        <div className="input-group">
                                            <span className="input-group-text">Ksh</span>
                                            <input
                                                type="number"
                                                id="errand_cost"
                                                name="errand_cost"
                                                placeholder="Enter budget amount"
                                                required
                                                min="1"
                                                className="form-control"
                                                value={formData.errand_cost}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="status" className="form-label">
                                            Status
                                        </label>
                                        <select
                                            id="status"
                                            name="status"
                                            className="form-select"
                                            value={formData.status}
                                            onChange={handleChange}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="mb-4">
                                    <label htmlFor="errand_photo" className="form-label">
                                        Task Photo (Optional)
                                    </label>
                                    <input
                                        type="file"
                                        id="errand_photo"
                                        name="errand_photo"
                                        className="form-control"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    {photoPreview && (
                                        <div className="mt-2">
                                            <img 
                                                src={photoPreview} 
                                                alt="Preview" 
                                                className="img-thumbnail" 
                                                style={{ maxHeight: "200px" }} 
                                            />
                                        </div>
                                    )}
                                    <div className="form-text">
                                        Upload an image that helps describe the task (JPEG, PNG)
                                    </div>
                                </div>
                                
                                <div className="d-grid">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary btn-lg"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Creating Task...
                                            </>
                                        ) : "Create Task"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateTask;
