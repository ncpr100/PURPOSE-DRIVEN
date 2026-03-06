'use client';

import { useState, useCallback } from 'react';

export interface DragDropEvent {
  id: string;
  title: string;
  startDate: string;
  endDate?: string;
  category: string;
  location?: string;
}

export interface DragDropCalendarHook {
  isDragging: boolean;
  draggedEvent: DragDropEvent | null;
  startDrag: (event: DragDropEvent) => void;
  endDrag: () => void;
  dropOnDate: (targetDate: Date, event: DragDropEvent) => Promise<void>;
  isDropTarget: (date: Date) => boolean;
  handleKeyboardMove: (event: DragDropEvent, direction: 'left' | 'right' | 'up' | 'down') => Promise<void>;
}

export function useDragDropCalendar(
  onEventMove: (eventId: string, newDate: Date) => Promise<void>
): DragDropCalendarHook {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedEvent, setDraggedEvent] = useState<DragDropEvent | null>(null);
  const [dropTargetDate, setDropTargetDate] = useState<Date | null>(null);

  const startDrag = useCallback((event: DragDropEvent) => {
    setIsDragging(true);
    setDraggedEvent(event);
  }, []);

  const endDrag = useCallback(() => {
    setIsDragging(false);
    setDraggedEvent(null);
    setDropTargetDate(null);
  }, []);

  const dropOnDate = useCallback(async (targetDate: Date, event: DragDropEvent) => {
    try {
      await onEventMove(event.id, targetDate);
      endDrag();
    } catch (error) {
      console.error('Error moving event:', error);
      endDrag();
    }
  }, [onEventMove, endDrag]);

  const isDropTarget = useCallback((date: Date) => {
    return dropTargetDate?.toDateString() === date.toDateString();
  }, [dropTargetDate]);

  const handleKeyboardMove = useCallback(async (event: DragDropEvent, direction: 'left' | 'right' | 'up' | 'down') => {
    const currentDate = new Date(event.startDate);
    const newDate = new Date(currentDate);

    switch (direction) {
      case 'left':
        newDate.setDate(newDate.getDate() - 1);
        break;
      case 'right':
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'up':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'down':
        newDate.setDate(newDate.getDate() + 7);
        break;
    }

    await dropOnDate(newDate, event);
  }, [dropOnDate]);

  return {
    isDragging,
    draggedEvent,
    startDrag,
    endDrag,
    dropOnDate,
    isDropTarget,
    handleKeyboardMove
  };
}

// Mobile touch handling utilities
export function useTouchDragDrop() {
  const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null);
  const [isTouchDragging, setIsTouchDragging] = useState(false);

  const handleTouchStart = useCallback((e: React.TouchEvent, event: DragDropEvent) => {
    const touch = e.touches[0];
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartPos) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartPos.x);
    const deltaY = Math.abs(touch.clientY - touchStartPos.y);

    // Start drag if moved significant distance
    if (deltaX > 10 || deltaY > 10) {
      setIsTouchDragging(true);
    }

    e.preventDefault(); // Prevent scrolling during drag
  }, [touchStartPos]);

  const handleTouchEnd = useCallback((e: React.TouchEvent, onDrop?: (element: Element) => void) => {
    if (isTouchDragging && onDrop) {
      const touch = e.changedTouches[0];
      const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
      
      if (elementBelow) {
        onDrop(elementBelow);
      }
    }

    setTouchStartPos(null);
    setIsTouchDragging(false);
  }, [isTouchDragging]);

  return {
    isTouchDragging,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
}

// Accessibility helpers
export function getDragDropAriaDescriptions() {
  return {
    draggableEvent: 'Evento arrastrable. Use las teclas de flecha para mover o presione Enter para editar.',
    dropTarget: 'Zona de destino válida. Suelte el evento aquí.',
    dropInstructions: 'Para mover un evento: Mantenga presionado y arrastre al día deseado, o use las teclas de flecha.',
    keyboardInstructions: 'Teclas disponibles: ← → para días anteriores/siguientes, ↑ ↓ para semana anterior/siguiente.'
  };
}