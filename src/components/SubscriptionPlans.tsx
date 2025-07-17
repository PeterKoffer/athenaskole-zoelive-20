
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: string;
  features: string[];
  popular?: boolean;
}

const SubscriptionPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  const plans: Plan[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$9.99/month',
      features: ['AI Tutoring', 'Basic Analytics', 'Email Support']
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$19.99/month',
      features: ['Advanced AI', 'Detailed Analytics', 'Priority Support', 'Custom Learning Paths'],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Contact Us',
      features: ['Full AI Suite', 'Complete Analytics', '24/7 Support', 'Custom Integration']
    }
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    console.log('Selected plan:', planId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto p-6">
      {plans.map((plan) => (
        <Card key={plan.id} className={`relative ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                Most Popular
              </span>
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
            <div className="text-2xl font-bold text-blue-600">{plan.price}</div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              onClick={() => handleSelectPlan(plan.id)}
              className={`w-full ${selectedPlan === plan.id ? 'bg-green-600' : 'bg-blue-600'} hover:opacity-90`}
            >
              {selectedPlan === plan.id ? 'Selected' : 'Choose Plan'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SubscriptionPlans;
