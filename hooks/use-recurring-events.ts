'use client';

import { useState } from 'react';

export type RecurrencePattern = 
  | 'daily' 
  | 'weekly' 
  | 'bi-weekly' 
  | 'monthly' 
  | 'yearly' 
  | 'custom';

export interface RecurrenceRule {
  pattern: RecurrencePattern;
  interval: number; // Every X days/weeks/months
  daysOfWeek?: number[]; // 0=Sunday, 1=Monday, etc.
  dayOfMonth?: number; // For monthly recurrence
  endDate?: Date;
  occurrences?: number; // Max number of occurrences
  weekOfMonth?: number; // 1st, 2nd, 3rd, 4th week
}

export interface RecurringEventTemplate {
  title: string;
  description?: string;
  duration: number; // Duration in minutes
  location?: string;
  category: string;
  recurrence: RecurrenceRule;
  startDate: Date;
  churchId: string;
}

// Spanish day names for UI
export const SPANISH_DAYS = [
  { value: 0, label: 'Domingo', short: 'Dom' },
  { value: 1, label: 'Lunes', short: 'Lun' },
  { value: 2, label: 'Martes', short: 'Mar' },
  { value: 3, label: 'Miércoles', short: 'Mié' },
  { value: 4, label: 'Jueves', short: 'Jue' },
  { value: 5, label: 'Viernes', short: 'Vie' },
  { value: 6, label: 'Sábado', short: 'Sáb' }
];

// Common church event patterns
export const CHURCH_RECURRENCE_PRESETS = [
  {
    name: 'Servicio Dominical',
    pattern: 'weekly' as RecurrencePattern,
    interval: 1,
    daysOfWeek: [0], // Sunday
    suggestedTime: '10:00',
    category: 'Servicio'
  },
  {
    name: 'Estudio Bíblico Semanal',
    pattern: 'weekly' as RecurrencePattern,
    interval: 1,
    daysOfWeek: [3], // Wednesday
    suggestedTime: '19:00',
    category: 'Estudio'
  },
  {
    name: 'Reunión de Oración Mensual',
    pattern: 'monthly' as RecurrencePattern,
    interval: 1,
    dayOfMonth: 1, // First Friday of month
    suggestedTime: '19:30',
    category: 'Oración'
  },
  {
    name: 'Servicio de Jóvenes',
    pattern: 'weekly' as RecurrencePattern,
    interval: 1,
    daysOfWeek: [5], // Friday
    suggestedTime: '20:00',
    category: 'Jóvenes'
  },
  {
    name: 'Reunión de Células',
    pattern: 'bi-weekly' as RecurrencePattern,
    interval: 2,
    daysOfWeek: [2, 4], // Tuesday, Thursday
    suggestedTime: '19:00',
    category: 'Células'
  }
];

export function useRecurringEvents() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateRecurrencePattern = (
    startDate: Date,
    recurrence: RecurrenceRule
  ): Date[] => {
    const occurrences: Date[] = [];
    let currentDate = new Date(startDate);
    const maxDate = recurrence.endDate || new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate());
    const maxOccurrences = recurrence.occurrences || 52; // Default 1 year for weekly events

    let count = 0;

    while (currentDate <= maxDate && count < maxOccurrences) {
      switch (recurrence.pattern) {
        case 'daily':
          if (count > 0) {
            currentDate.setDate(currentDate.getDate() + recurrence.interval);
          }
          break;

        case 'weekly':
          if (count === 0) {
            // First occurrence is the start date
            occurrences.push(new Date(currentDate));
            count++;
          }
          
          // Find next occurrence based on days of week
          if (recurrence.daysOfWeek && recurrence.daysOfWeek.length > 0) {
            let foundNext = false;
            let checkDate = new Date(currentDate);
            checkDate.setDate(checkDate.getDate() + 1);

            for (let i = 0; i < 7; i++) {
              if (recurrence.daysOfWeek.includes(checkDate.getDay())) {
                currentDate = new Date(checkDate);
                foundNext = true;
                break;
              }
              checkDate.setDate(checkDate.getDate() + 1);
            }

            if (!foundNext) {
              currentDate.setDate(currentDate.getDate() + 7 * recurrence.interval);
            }
          } else {
            currentDate.setDate(currentDate.getDate() + 7 * recurrence.interval);
          }
          break;

        case 'bi-weekly':
          if (count === 0) {
            occurrences.push(new Date(currentDate));
            count++;
          }
          currentDate.setDate(currentDate.getDate() + 14);
          break;

        case 'monthly':
          if (count > 0) {
            if (recurrence.dayOfMonth) {
              currentDate.setMonth(currentDate.getMonth() + recurrence.interval);
              currentDate.setDate(recurrence.dayOfMonth);
            } else {
              currentDate.setMonth(currentDate.getMonth() + recurrence.interval);
            }
          }
          break;

        case 'yearly':
          if (count > 0) {
            currentDate.setFullYear(currentDate.getFullYear() + recurrence.interval);
          }
          break;
      }

      if (count > 0 && currentDate <= maxDate) {
        occurrences.push(new Date(currentDate));
      }

      if (count === 0) count++;
      else count++;
    }

    return occurrences;
  };

  const createRecurringEvents = async (
    template: RecurringEventTemplate
  ): Promise<{ success: boolean; eventsCreated: number; error?: string }> => {
    setIsGenerating(true);

    try {
      const occurrences = generateRecurrencePattern(template.startDate, template.recurrence);
      
      const eventsToCreate = occurrences.map(date => ({
        title: template.title,
        description: template.description || '',
        startDate: date,
        endDate: new Date(date.getTime() + template.duration * 60 * 1000), // Add duration
        location: template.location || '',
        category: template.category,
        churchId: template.churchId,
        isRecurring: true,
        recurrenceRule: template.recurrence
      }));

      const response = await fetch('/api/events/recurring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          events: eventsToCreate,
          template: template
        })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      setIsGenerating(false);
      return {
        success: true,
        eventsCreated: result.eventsCreated || eventsToCreate.length
      };

    } catch (error) {
      setIsGenerating(false);
      return {
        success: false,
        eventsCreated: 0,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  };

  const deleteRecurringSeries = async (
    eventId: string,
    deleteOption: 'this' | 'following' | 'all'
  ): Promise<{ success: boolean; eventsDeleted: number; error?: string }> => {
    try {
      const response = await fetch('/api/events/recurring', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventId,
          deleteOption
        })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        eventsDeleted: result.eventsDeleted || 0
      };

    } catch (error) {
      return {
        success: false,
        eventsDeleted: 0,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  };

  return {
    isGenerating,
    generateRecurrencePattern,
    createRecurringEvents,
    deleteRecurringSeries
  };
}

// Utility functions for UI components
export function getRecurrenceDescription(recurrence: RecurrenceRule): string {
  const { pattern, interval, daysOfWeek, dayOfMonth } = recurrence;

  switch (pattern) {
    case 'daily':
      return interval === 1 ? 'Diario' : `Cada ${interval} días`;
    
    case 'weekly':
      if (daysOfWeek && daysOfWeek.length > 0) {
        const dayNames = daysOfWeek.map(day => SPANISH_DAYS[day].short).join(', ');
        return interval === 1 ? `Semanal (${dayNames})` : `Cada ${interval} semanas (${dayNames})`;
      }
      return interval === 1 ? 'Semanal' : `Cada ${interval} semanas`;
    
    case 'bi-weekly':
      return 'Quincenal';
    
    case 'monthly':
      if (dayOfMonth) {
        return `Mensual (día ${dayOfMonth})`;
      }
      return interval === 1 ? 'Mensual' : `Cada ${interval} meses`;
    
    case 'yearly':
      return interval === 1 ? 'Anual' : `Cada ${interval} años`;
    
    default:
      return 'Personalizado';
  }
}

export function validateRecurrenceRule(rule: RecurrenceRule): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!rule.pattern) {
    errors.push('Patrón de recurrencia requerido');
  }

  if (rule.interval < 1) {
    errors.push('El intervalo debe ser mayor a 0');
  }

  if (rule.pattern === 'weekly' && rule.daysOfWeek && rule.daysOfWeek.length === 0) {
    errors.push('Debe seleccionar al menos un día de la semana');
  }

  if (rule.pattern === 'monthly' && rule.dayOfMonth && (rule.dayOfMonth < 1 || rule.dayOfMonth > 31)) {
    errors.push('Día del mes debe estar entre 1 y 31');
  }

  if (rule.endDate && rule.endDate < new Date()) {
    errors.push('La fecha de finalización no puede ser en el pasado');
  }

  if (rule.occurrences && rule.occurrences < 1) {
    errors.push('El número de ocurrencias debe ser mayor a 0');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}