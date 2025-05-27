
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
      description: "Gratis for alle danske elever",
      price: { monthly: 0, yearly: 0 },
      icon: "📚",
      color: "border-gray-300",
      buttonColor: "bg-gray-600 hover:bg-gray-700",
      features: [
        "30 minutter læring om dagen",
        "Grundlæggende matematik og dansk",
        "1 spil tilgængeligt",
        "Basis fremskridtsrapport",
        "GDPR-sikker data i EU"
      ],
      limitations: [
        "Begrænset AI-tutor tid",
        "Ingen forældreanalyse",
        "Ingen premium spil"
      ]
    },
    {
      id: "premium",
      name: "Premium",
      description: "Fuld læreplan for seriøse elever",
      price: { monthly: 99, yearly: 990 },
      icon: "⭐",
      color: "border-blue-500 bg-blue-50",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      popular: true,
      features: [
        "Ubegrænset læring (2 timer dagligt)",
        "Alle fag: Matematik, Dansk, Engelsk, Natur & Teknik",
        "Alle premium spil og aktiviteter",
        "Ugentlige forældreemails med analyse",
        "AI-tutor med dansk stemme",
        "Personlig læringsplan",
        "Detaljeret fremskridtsanalyse",
        "Prioriteret kundesupport"
      ]
    },
    {
      id: "family",
      name: "Familie",
      description: "For familier med flere børn",
      price: { monthly: 199, yearly: 1990 },
      icon: "👨‍👩‍👧‍👦",
      color: "border-green-500 bg-green-50",
      buttonColor: "bg-green-600 hover:bg-green-700",
      features: [
        "Op til 4 børn på samme konto",
        "Alle Premium funktioner",
        "Familiedashboard for forældre",
        "Søskende konkurrencer og udfordringer",
        "Månedlige familie læring-aktiviteter",
        "Ekstra forældreguidance",
        "25% besparelse per barn"
      ]
    }
  ];

  const schoolPlan = {
    name: "Skole Licens",
    description: "Bulk-løsning til kommuner og skoler",
    icon: "🏫",
    features: [
      "Ubegrænset antal elever",
      "Lærer-dashboard med klasse analyser",
      "Integration med eksisterende skolesystemer",
      "GDPR-compliance og datasikkerhed",
      "Træning og support til lærere",
      "Tilpasset til Folkeskole curriculum",
      "Månedlige rapporter til skoleledelse"
    ]
  };

  const handleSubscribe = (planId) => {
    if (planId === "basic") {
      alert("Du er allerede på Basic planen! Opgrader for at få adgang til alle funktioner.");
      return;
    }
    
    alert(`Omdirigerer til betaling for ${planId} plan... 💳`);
    // In real implementation, this would redirect to Stripe checkout
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Billing Toggle */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Vælg din læringsplan 🇩🇰
        </h2>
        <p className="text-gray-600 mb-6">
          Læreleg følger danske værdier om lige adgang til uddannelse
        </p>
        
        <div className="inline-flex rounded-lg bg-gray-100 p-1">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === "monthly"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setBillingCycle("monthly")}
          >
            Månedligt
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === "yearly"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setBillingCycle("yearly")}
          >
            Årligt <Badge variant="secondary" className="ml-1 bg-green-100 text-green-700">Spar 2 måneder</Badge>
          </button>
        </div>
      </div>

      {/* Personal Plans */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative ${plan.color} ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white">
                  <Crown className="w-3 h-3 mr-1" />
                  Mest populær
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <div className="text-4xl mb-2">{plan.icon}</div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <p className="text-sm text-gray-600">{plan.description}</p>
              
              <div className="py-4">
                {plan.price.monthly === 0 ? (
                  <div className="text-3xl font-bold text-gray-800">Gratis</div>
                ) : (
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-gray-800">
                      {billingCycle === "monthly" ? plan.price.monthly : Math.floor(plan.price.yearly / 12)} DKK
                    </div>
                    <div className="text-sm text-gray-600">
                      per måned{billingCycle === "yearly" && " (betalt årligt)"}
                    </div>
                    {billingCycle === "yearly" && plan.price.monthly > 0 && (
                      <div className="text-xs text-green-600 font-medium">
                        Spar {(plan.price.monthly * 12 - plan.price.yearly)} DKK årligt
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <Button 
                className={`w-full ${plan.buttonColor}`}
                onClick={() => handleSubscribe(plan.id)}
              >
                {plan.id === "basic" ? "Nuværende plan" : "Vælg denne plan"}
              </Button>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800">Inkluderet:</h4>
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              {plan.limitations && (
                <div className="space-y-2 pt-2 border-t">
                  <h4 className="font-semibold text-gray-600">Begrænsninger:</h4>
                  {plan.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                      <span className="w-4 h-4 text-gray-400 mt-0.5">•</span>
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
      <Card className="border-2 border-purple-300 bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            <div className="flex items-center justify-center space-x-3">
              <span className="text-4xl">{schoolPlan.icon}</span>
              <span>{schoolPlan.name}</span>
              <Building className="w-6 h-6 text-purple-600" />
            </div>
          </CardTitle>
          <p className="text-center text-gray-600">{schoolPlan.description}</p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">Perfekt til:</h4>
              <div className="space-y-2">
                {schoolPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Priser for kommuner:</h4>
                <div className="space-y-1 text-sm">
                  <div>• 1-100 elever: 50 DKK/elev/måned</div>
                  <div>• 101-500 elever: 40 DKK/elev/måned</div>
                  <div>• 500+ elever: Kontakt for tilbud</div>
                </div>
              </div>
              
              <Button className="w-full bg-purple-600 hover:bg-purple-700" size="lg">
                <Users className="w-4 h-4 mr-2" />
                Kontakt salg
              </Button>
              
              <p className="text-xs text-center text-gray-600">
                Eksempel: Aarhus Kommune, Frederiksberg Kommune
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trust Indicators */}
      <Card className="bg-gray-50">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl mb-2">🇪🇺</div>
              <h4 className="font-semibold text-gray-800">GDPR Compliant</h4>
              <p className="text-sm text-gray-600">
                Alle data gemmes sikkert i EU og følger danske privacy-regler
              </p>
            </div>
            <div>
              <div className="text-2xl mb-2">🏫</div>
              <h4 className="font-semibold text-gray-800">Folkeskole Tilpasset</h4>
              <p className="text-sm text-gray-600">
                Udviklet efter Undervisningsministeriets læseplaner
              </p>
            </div>
            <div>
              <div className="text-2xl mb-2">💪</div>
              <h4 className="font-semibold text-gray-800">Opsig når som helst</h4>
              <p className="text-sm text-gray-600">
                Ingen bindinger - opsig din subscription med 30 dages varsel
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionPlans;
