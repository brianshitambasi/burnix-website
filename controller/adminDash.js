const {Donors,Volunteers,Requests,Users} =require('/models/models');

// get dashboard data statistics for admin
exports.adminDashStats = async (req, res) => {
    try {
        const [totalDonors, totalVolunteers, totalRequests,activeUsers] = 
        await Promise.all([
            Donors.countDocuments(),
        Volunteers  .countDocuments(),
                Requests.countDocuments(),
            Users.countDocuments({isActive: true})
            ]);

        const recentStudents = await Student.find({})
        .sort({createdAt: -1})
        .limit(5)

        const recentDonors = await Donors.find({})
        .sort({createdAt: -1})
        .limit(5)

        
        const recentRequests = await Requests.find({})
        .sort({createdAt: -1})
        .limit(5)

        const RecentVolunteers = await Volunteers.find({})
        .sort({createdAt: -1})
        .limit(5)

      
        // return all the stats 
        res.status(200).json({
            totalDonors,
            totalVolunteers,
            totalRequests,
            activeUsers,
            recentStudents,
            recentDonors,
            recentRequests,
            RecentVolunteers
        });
        
   } catch (error) {
        
        res.status(500).json({ error: 'Internal server error' });
        
    }
}