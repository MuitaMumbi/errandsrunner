// const CreateTask = () => {
//     const [errand_name, setErrandName] = useState("");
//     const [errand_desc, setErrandDesc] = useState("");
//     const [errand_cost, setErrandCost] = useState("");
//     const [errand_deadline, setDeadline] = useState("");
//     const [errand_photo, setErrandPhoto] = useState(null);
    
//     const [loading, setLoading] = useState("");
//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");

    
//     const [photoPreview, setPhotoPreview] = useState(null); // State to preview image
//     const navigate = useNavigate();
//     const user = JSON.parse(localStorage.getItem("user"));

//     const checkUser = () => {
//         if (!user) {
//             localStorage.clear();
//             navigate("/signin");
//         }
//     };

//     useEffect(() => {
//         checkUser();
//     }, [user]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         setFormData(prev => ({
//             ...prev,
//             errand_photo: file
//         }));
        
//         // Preview image
//         const reader = new FileReader();
//         reader.onloadend = () => {
//             setPhotoPreview(reader.result);
//         };
//         if (file) {
//             reader.readAsDataURL(file);
//         }
//     };

//     const submitForm = async (e) => {
//         e.preventDefault();
//         if (!errand_name || !errand_desc || !errand_cost) {
//             toast.error("Please fill in all required fields.");
//             return;
//         }

//         try {
//             setLoading(true);
            
//             const data = new FormData();
//             data.append("errand_name", errand_name);
//             data.append("errand_desc", errand_desc);
//             data.append("errand_cost", errand_cost);
//             data.append("creator_id", user.user_id);
//             data.append("status", status);
//             data.append("errand_photo", errand_photo);
           
//             const response = await axios.post(
//                 "https://Muita.pythonanywhere.com/api/adderrand", 
//                 data,
//                 {
//                  headers: {
//                  'Content-Type': 'application/json',}}
//             );
            
//             toast.success(response.data.success || "Task created successfully!");
//             setFormData({
//                 errand_name: "",
//                 errand_desc: "",
//                 errand_cost: "",
//                 errand_photo: null,
//                 status: "pending"
//             });
//             setPhotoPreview(null); // Clear photo preview
            
//         } catch (error) {
//             toast.error(error.response?.data?.message || "Failed to create task. Please try again.");
//             console.error("Error creating task:", error);
//         } finally {
//             setLoading(false);
//         }
//     };