/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Separator } from "../../ui/separator";
import { CreditCard, DollarSign, Calendar, Target, Users } from "lucide-react";
import { toast } from "sonner";

interface PaymentStepsProps {
  campaign: any;
  onPaymentSuccess: () => void;
  onClose: () => void;
}

export const PaymentSteps: React.FC<PaymentStepsProps> = ({
  campaign,
  onPaymentSuccess,
  onClose,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentMethodSelect = (method: 'stripe' | 'paypal') => {
    setPaymentMethod(method);
  };

  const handleStripePayment = async () => {
    setIsProcessing(true);
    try {
      // Simulate Stripe payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would:
      // 1. Create a Stripe Payment Intent
      // 2. Redirect to Stripe Checkout or use Stripe Elements
      // 3. Handle the payment confirmation
      
      toast.success("Payment processed successfully!");
      onPaymentSuccess();
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPalPayment = async () => {
    setIsProcessing(true);
    try {
      // Simulate PayPal payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would:
      // 1. Create a PayPal order
      // 2. Redirect to PayPal for payment
      // 3. Handle the payment confirmation
      
      toast.success("Payment processed successfully!");
      onPaymentSuccess();
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: campaign.budget?.currency || 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Campaign Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Campaign Summary
          </CardTitle>
          <CardDescription>
            Review your campaign details before proceeding to payment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">{campaign.name}</h4>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{campaign.objective}</Badge>
                <Badge variant="secondary">{campaign.status}</Badge>
              </div>
            </div>
            
            <div className="space-y-2 text-right">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(campaign.payment?.totalCost || 0)}
              </div>
              <p className="text-sm text-gray-500">Total Campaign Cost</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium">{campaign.budget?.type} Budget</p>
                <p className="text-sm text-gray-500">
                  {formatCurrency(campaign.budget?.amount || 0)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-sm text-gray-500">
                  {formatDate(campaign.schedule?.startDate)} - {formatDate(campaign.schedule?.endDate)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium">Targeting</p>
                <p className="text-sm text-gray-500">
                  {campaign.targeting?.demographics?.ageMin || 18}-{campaign.targeting?.demographics?.ageMax || 65} years
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-green-600" />
            Select Payment Method
          </CardTitle>
          <CardDescription>
            Choose your preferred payment method to activate your campaign
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant={paymentMethod === 'stripe' ? 'default' : 'outline'}
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={() => handlePaymentMethodSelect('stripe')}
              disabled={isProcessing}
            >
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium">Credit Card</span>
              <span className="text-xs text-gray-500">via Stripe</span>
            </Button>

            <Button
              variant={paymentMethod === 'paypal' ? 'default' : 'outline'}
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={() => handlePaymentMethodSelect('paypal')}
              disabled={isProcessing}
            >
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="font-medium">PayPal</span>
              <span className="text-xs text-gray-500">Secure payment</span>
            </Button>
          </div>

          {paymentMethod && (
            <div className="mt-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Payment Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Campaign Cost:</span>
                    <span className="font-medium">{formatCurrency(campaign.payment?.totalCost || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Fee:</span>
                    <span className="font-medium">{formatCurrency(0)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium text-blue-900">
                    <span>Total:</span>
                    <span>{formatCurrency(campaign.payment?.totalCost || 0)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={paymentMethod === 'stripe' ? handleStripePayment : handlePayPalPayment}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    `Pay ${formatCurrency(campaign.payment?.totalCost || 0)}`
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setPaymentMethod(null)}
                  disabled={isProcessing}
                >
                  Change Method
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={onClose} disabled={isProcessing}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
