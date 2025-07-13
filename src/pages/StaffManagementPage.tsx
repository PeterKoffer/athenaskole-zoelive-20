
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Search, UserPlus, Mail, Phone } from 'lucide-react';

const StaffManagementPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock staff data
  const staff = [
    { 
      id: 1, 
      name: "Ms. Johnson", 
      role: "Math Teacher", 
      email: "johnson@school.edu",
      phone: "+45 12 34 56 78",
      classes: ["3.A Math", "4.B Math"],
      status: "Active" 
    },
    { 
      id: 2, 
      name: "Mr. Anderson", 
      role: "English Teacher", 
      email: "anderson@school.edu",
      phone: "+45 87 65 43 21",
      classes: ["2.A English", "2.B English"],
      status: "Active" 
    },
    { 
      id: 3, 
      name: "Dr. Smith", 
      role: "Science Teacher", 
      email: "smith@school.edu",
      phone: "+45 11 22 33 44",
      classes: ["4.A Science", "5.A Science"],
      status: "Active" 
    },
    { 
      id: 4, 
      name: "Ms. Brown", 
      role: "Art Teacher", 
      email: "brown@school.edu",
      phone: "+45 55 66 77 88",
      classes: ["All Grades Art"],
      status: "Part-time" 
    },
  ];

  const filteredStaff = staff.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/school-dashboard')}
              className="text-muted-foreground hover:text-foreground mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Staff Management</h1>
              <p className="text-muted-foreground">Monitor teacher performance and staff assignments</p>
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <UserPlus className="w-4 h-4 mr-2" />
            Add New Staff
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Search staff by name or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">Filter by Department</Button>
              <Button variant="outline">Performance Reports</Button>
            </div>
          </CardContent>
        </Card>

        {/* Staff Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredStaff.map((member) => (
            <Card key={member.id} className="bg-card border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <Badge variant={member.status === 'Active' ? 'default' : 'secondary'}>
                    {member.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{member.role}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>{member.phone}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Classes:</p>
                    <div className="flex flex-wrap gap-1">
                      {member.classes.map((className, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {className}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Schedule
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStaff.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No staff found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms or add new staff members.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StaffManagementPage;
