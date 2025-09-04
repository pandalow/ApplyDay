import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Extracting from "./Extracting";
import JDItem from "./JDItem.jsx";
import { fetchJDs, createJD, deleteJD, updateJD } from "../service/report";

function JDPage() {
    const [jdList, setJDList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterLevel, setFilterLevel] = useState("");
    const [filterCompany, setFilterCompany] = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newJD, setNewJD] = useState({
        company: "",
        role: "",
        location: "",
        level: "",
        employment_type: "",
        salary_eur_min: "",
        salary_eur_max: ""
    });

    // Load JDs on component mount
    useEffect(() => {
        loadJDs();
    }, []);

    const loadJDs = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchJDs();
            setJDList(data);
        } catch (err) {
            setError("Failed to load job descriptions. Please try again.");
            console.error("Error loading JDs:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateJD = async () => {
        if (!newJD.company || !newJD.role) {
            setError("Company and role are required fields.");
            return;
        }

        try {
            const createdJD = await createJD(newJD);
            setJDList(prev => [createdJD, ...prev]);
            setNewJD({
                company: "",
                role: "",
                location: "",
                level: "",
                employment_type: "",
                salary_eur_min: "",
                salary_eur_max: ""
            });
            setShowCreateForm(false);
            setError(null);
        } catch (err) {
            setError("Failed to create job description. Please try again.");
            console.error("Error creating JD:", err);
        }
    };

    const handleUpdateJD = async (id, updatedData) => {
        try {
            const updatedJD = await updateJD(id, updatedData);
            setJDList(prev => prev.map(jd => jd.id === id ? updatedJD : jd));
            setError(null);
        } catch (err) {
            setError("Failed to update job description. Please try again.");
            console.error("Error updating JD:", err);
        }
    };

    const handleDeleteJD = async (id) => {
        if (!window.confirm("Are you sure you want to delete this job description?")) {
            return;
        }

        try {
            await deleteJD(id);
            setJDList(prev => prev.filter(jd => jd.id !== id));
            setError(null);
        } catch (err) {
            setError("Failed to delete job description. Please try again.");
            console.error("Error deleting JD:", err);
        }
    };

    // Filter and search logic
    const filteredJDs = jdList.filter(jd => {
        const matchesSearch = searchTerm === "" || 
            jd.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            jd.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            jd.location?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesLevel = filterLevel === "" || jd.level === filterLevel;
        const matchesCompany = filterCompany === "" || jd.company === filterCompany;
        
        return matchesSearch && matchesLevel && matchesCompany;
    });

    // Get unique companies for filter
    const uniqueCompanies = [...new Set(jdList.map(jd => jd.company).filter(Boolean))];

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Job Descriptions
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Manage and review extracted job descriptions
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg"
                >
                    <p className="text-red-700 dark:text-red-400">{error}</p>
                </motion.div>
            )}

            {/* Extracting Section */}
            <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Extract New Job Descriptions
                </h2>
                <Extracting onSuccess={loadJDs} />
            </div>

            {/* Controls Section */}
            <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-4">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        {/* Search */}
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search by company, role, or location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        {/* Level Filter */}
                        <select
                            value={filterLevel}
                            onChange={(e) => setFilterLevel(e.target.value)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">All Levels</option>
                            <option value="junior">Junior</option>
                            <option value="mid">Mid</option>
                            <option value="senior">Senior</option>
                            <option value="lead">Lead</option>
                            <option value="principal">Principal</option>
                        </select>

                        {/* Company Filter */}
                        <select
                            value={filterCompany}
                            onChange={(e) => setFilterCompany(e.target.value)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">All Companies</option>
                            {uniqueCompanies.map(company => (
                                <option key={company} value={company}>{company}</option>
                            ))}
                        </select>
                    </div>

                    {/* Add New Button */}
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                    >
                        {showCreateForm ? "Cancel" : "Add New JD"}
                    </button>
                </div>

                {/* Results Count */}
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {filteredJDs.length} of {jdList.length} job descriptions
                </div>
            </div>

            {/* Create Form */}
            <AnimatePresence>
                {showCreateForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Create New Job Description
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Company *
                                </label>
                                <input
                                    type="text"
                                    value={newJD.company}
                                    onChange={(e) => setNewJD({...newJD, company: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Role *
                                </label>
                                <input
                                    type="text"
                                    value={newJD.role}
                                    onChange={(e) => setNewJD({...newJD, role: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={newJD.location}
                                    onChange={(e) => setNewJD({...newJD, location: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Level
                                </label>
                                <select
                                    value={newJD.level}
                                    onChange={(e) => setNewJD({...newJD, level: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="">Select Level</option>
                                    <option value="junior">Junior</option>
                                    <option value="mid">Mid</option>
                                    <option value="senior">Senior</option>
                                    <option value="lead">Lead</option>
                                    <option value="principal">Principal</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowCreateForm(false)}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateJD}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                            >
                                Create JD
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">Loading job descriptions...</span>
                </div>
            )}

            {/* JD List */}
            {!loading && (
                <div className="space-y-4">
                    <AnimatePresence>
                        {filteredJDs.length > 0 ? (
                            filteredJDs.map((jd) => (
                                <JDItem
                                    key={jd.id}
                                    jd={jd}
                                    onUpdate={handleUpdateJD}
                                    onDelete={handleDeleteJD}
                                />
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                            >
                                <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📄</div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    No job descriptions found
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    {searchTerm || filterLevel || filterCompany
                                        ? "Try adjusting your search filters"
                                        : "Extract some job descriptions to get started"
                                    }
                                </p>
                                {(!searchTerm && !filterLevel && !filterCompany) && (
                                    <button
                                        onClick={() => setShowCreateForm(true)}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                    >
                                        Add First JD
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}

export default JDPage;
