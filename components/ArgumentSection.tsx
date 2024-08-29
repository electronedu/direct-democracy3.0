"use client";

import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";

interface ArgumentSectionProps {
  title: string;
  arguments: Array<{ id: string; text: string; importance: number }>;
  setArguments: (
    args: Array<{ id: string; text: string; importance: number }>
  ) => void;
  totalPercentage: number;
  isFor: boolean;
  droppableId: string;
}

const ArgumentSection: React.FC<ArgumentSectionProps> = ({
  title,
  arguments: args,
  setArguments,
  totalPercentage,
  isFor,
  droppableId,
}) => {
  const [newArgument, setNewArgument] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addArgument = () => {
    if (newArgument.trim() && args.length < 10) {
      const newArg = {
        id: Date.now().toString(),
        text: newArgument.trim(),
        importance: 0,
      };
      setArguments([...args, newArg]);
      setNewArgument("");
    }
  };

  const updateImportance = (id: string, importance: number) => {
    const newArgs = args.map((arg) =>
      arg.id === id ? { ...arg, importance } : arg
    );
    setArguments(newArgs);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = args.findIndex((item) => item.id === active.id);
      const newIndex = args.findIndex((item) => item.id === over?.id);
      setArguments(arrayMove(args, oldIndex, newIndex));
    }
  };

  const sectionTotalPercentage = args.reduce(
    (sum, arg) => sum + arg.importance,
    0
  );

  return (
    <div className="w-full md:w-1/2 p-4 border border-border rounded-lg bg-card text-card-foreground">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">{title}</h2>
      <div className="mb-4 text-lg font-medium">
        Total {title}: {sectionTotalPercentage}%
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={args} strategy={verticalListSortingStrategy}>
          <ul className="mb-4 space-y-4">
            {args.map((arg) => (
              <SortableItem key={arg.id} id={arg.id}>
                <li className="p-4 bg-muted rounded-lg">
                  <Textarea
                    value={arg.text}
                    onChange={(e) => {
                      const newArgs = args.map((a) =>
                        a.id === arg.id ? { ...a, text: e.target.value } : a
                      );
                      setArguments(newArgs);
                    }}
                    className="mb-2 w-full"
                    rows={3}
                  />
                  <Label
                    htmlFor={`importance-${arg.id}`}
                    className="mb-1 block"
                  >
                    Argument Importance
                  </Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      id={`importance-${arg.id}`}
                      value={[arg.importance]}
                      onValueChange={(value) =>
                        updateImportance(arg.id, value[0])
                      }
                      max={100 - totalPercentage + arg.importance}
                      step={1}
                      className="flex-grow"
                    />
                    <span className="text-sm">{arg.importance}%</span>
                  </div>
                </li>
              </SortableItem>
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      {args.length < 10 && (
        <div className="space-y-2">
          <Label htmlFor="new-argument">New Argument</Label>
          <Textarea
            id="new-argument"
            value={newArgument}
            onChange={(e) => setNewArgument(e.target.value)}
            placeholder="Enter your argument"
            className="w-full"
            rows={3}
          />
          <Button onClick={addArgument} variant="outline" className="mt-2">
            Add
          </Button>
        </div>
      )}
    </div>
  );
};

export default ArgumentSection;
