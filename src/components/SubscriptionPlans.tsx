
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Users, Building } from "lucide-react";

const SubscriptionPlans = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const plans = [
    {
      id: "basic",
      name: "Basic",
      description: "Free for all students",
      price: { monthly: 0, yearly: 0 },
      icon: "📚",
      color: "border-gray-300",
      buttonColor: "bg-gray-600 hover:bg-gray-700",
      features: [
        "30 minutes of learning per day",
        "Basic math and language",
        "1 game available",
        "Basic progress report",
        "GDPR-secure data in US"
      ],
      limitations: [
        "Limited AI-tutor time",
        "No parent analytics",
        "No premium games"
      ]
    },
    {
      id: "premium",
      name: "Premium",
      description: "Full curriculum for serious learners",
      price: { monthly: 9.99, yearly: 99.99 },
      icon: "⭐",
      color: "border-blue-500 bg-blue-50",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      popular: true,
      features: [
        "Unlimited learning (2 hours daily)",
        "All subjects: Math, English, Science, Technology",
        "All premium games and activities",
        "Weekly parent emails with analysis",
        "AI-tutor with English voice",
        "Personal learning plan",
        "Detailed progress analytics",
        "Priority customer support"
      ]
    },
    {
      id: "family",
      name: "Family",
      description: "For families with multiple children",
      price: { monthly: 19.99, yearly: 199.99 },
      icon: "👨‍👩‍👧‍👦",
      color: "border-green-500 bg-green-50",
      buttonColor: "bg-green-600 hover:bg-green-700",
      features: [
        "Up to 4 children on same account",
        "All Premium features",
        "Family dashboard for parents",
        "Sibling competitions and challenges",
        "Monthly family learning activities",
        "Extra parent guidance",
        "25% savings per child"
      ]
    }
  ];

  const schoolPlan = {
    name: "School License",
    description: "Bulk solution for districts and schools",
    icon: "🏫",
    features: [
      "Unlimited number of students",
      "Teacher dashboard with class analytics",
      "Integration with existing school systems",
      "GDPR-compliance and data security",
      "Training and support for teachers",
      "Adapted to school curriculum",
      "Monthly reports to school administration"
    ]
  };

  const handleSubscribe = (planId) => {
    if (planId === "basic") {
      alert("You are already on the Basic plan! Upgrade to get access to all features.");
      return;
    }
    
    alert(`Redirecting to payment for ${planId} plan... 💳`);
    // In real implementation, this would redirect to Stripe checkout
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Billing Toggle */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Choose Your Learning Plan 🇺🇸
        </h2>
        <p className="text-gray-400 mb-6">
          Quality education accessible to everyone
        </p>
        
        <div className="inline-flex rounded-lg bg-gray-700 p-1">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === "monthly"
                ? "bg-gray-600 text-white shadow-sm"
                : "text-gray-300 hover:text-white"
            }`}
            onClick={() => setBillingCycle("monthly")}
          >
            Monthly
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === "yearly"
                ? "bg-gray-600 text-white shadow-sm"
                : "text-gray-300 hover:text-white"
            }`}
            onClick={() => setBillingCycle("yearly")}
          >
            Yearly <Badge variant="secondary" className="ml-1 bg-green-600 text-white">Save 2 months</Badge>
          </button>
        </div>
      </div>

      {/* Personal Plans */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative bg-gray-800 border-gray-700 ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white">
                  <Crown className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <div className="text-4xl mb-2">{plan.icon}</div>
              <CardTitle className="text-xl text-white">{plan.name}</CardTitle>
              <p className="text-sm text-gray-400">{plan.description}</p>
              
              <div className="py-4">
                {plan.price.monthly === 0 ? (
                  <div className="text-3xl font-bold text-white">Free</div>
                ) : (
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-white">
                      ${billingCycle === "monthly" ? plan.price.monthly : Math.floor(plan.price.yearly / 12).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-400">
                      per month{billingCycle === "yearly" && " (billed annually)"}
                    </div>
                    {billingCycle === "yearly" && plan.price.monthly > 0 && (
                      <div className="text-xs text-green-400 font-medium">
                        Save ${((plan.price.monthly * 12) - plan.price.yearly).toFixed(2)} annually
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <Button 
                className={`w-full ${plan.buttonColor} text-white`}
                onClick={() => handleSubscribe(plan.id)}
              >
                {plan.id === "basic" ? "Current Plan" : "Choose This Plan"}
              </Button>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-white">Included:</h4>
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
              
              {plan.limitations && (
                <div className="space-y-2 pt-2 border-t border-gray-700">
                  <h4 className="font-semibold text-gray-400">Limitations:</h4>
                  {plan.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-start space-x-2 text-sm text-gray-400">
                      <span className="w-4 h-4 text-gray-500 mt-0.5">•</span>
                      <span>{limitation}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* School Plan */}
      <Card className="border-2 border-purple-500 bg-gray-800">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-white">
            <div className="flex items-center justify-center space-x-3">
              <span className="text-4xl">{schoolPlan.icon}</span>
              <span>{schoolPlan.name}</span>
              <Building className="w-6 h-6 text-purple-400" />
            </div>
          </CardTitle>
          <p className="text-center text-gray-400">{schoolPlan.description}</p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Perfect for:</h4>
              <div className="space-y-2">
                {schoolPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-300 mb-2">Pricing for districts:</h4>
                <div className="space-y-1 text-sm text-gray-300">
                  <div>• 1-100 students: $5/student/month</div>
                  <div>• 101-500 students: $4/student/month</div>
                  <div>• 500+ students: Contact for quote</div>
                </div>
              </div>
              
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" size="lg">
                <Users className="w-4 h-4 mr-2" />
                Contact Sales
              </Button>
              
              <p className="text-xs text-center text-gray-400">
                Example: New York School District, California Schools
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trust Indicators */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl mb-2">🇺🇸</div>
              <h4 className="font-semibold text-white">COPPA Compliant</h4>
              <p className="text-sm text-gray-400">
                All data stored securely in US and follows privacy regulations
              </p>
            </div>
            <div>
              <div className="text-2xl mb-2">🏫</div>
              <h4 className="font-semibold text-white">Curriculum Aligned</h4>
              <p className="text-sm text-gray-400">
                Developed according to Common Core standards
              </p>
            </div>
            <div>
              <div className="text-2xl mb-2">💪</div>
              <h4 className="font-semibold text-white">Cancel Anytime</h4>
              <p className="text-sm text-gray-400">
                No commitments - cancel your subscription with 30 days notice
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionPlans;
