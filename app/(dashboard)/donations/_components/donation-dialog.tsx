'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DonationForm } from './donation-form';

interface DonationDialogProps {
  categories: Array<{ id: string; name: string }>;
  paymentMethods: Array<{ id: string; name: string; isDigital: boolean }>;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DonationDialog({
  categories,
  paymentMethods,
  onSuccess,
  trigger,
  open,
  onOpenChange
}: DonationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setIsOpen(newOpen);
    }
  };

  const handleSuccess = () => {
    handleOpenChange(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  const isControlled = open !== undefined && onOpenChange !== undefined;

  return (
    <Dialog open={isControlled ? open : isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Donación
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Nueva Donación</DialogTitle>
          <DialogDescription>
            Complete la información de la donación recibida
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <DonationForm 
            categories={categories}
            paymentMethods={paymentMethods}
            onSuccess={handleSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}