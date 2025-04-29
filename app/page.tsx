/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Clock, Pencil, Plus, Search, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// Mock data
const mockChallenges = [
  {
    id: 1,
    name: "Hoody Challenge",
    description: "Daily hoodie wearing challenge",
  },
  {
    id: 2,
    name: "Cup Challenge",
    description: "30 minutes of exercise daily",
  },
  { id: 3, name: "Reading Challenge", description: "Read 20 pages daily" },
  {
    id: 4,
    name: "NPS-1 Challenge",
    description: "Solve one coding problem daily",
  },
  {
    id: 5,
    name: "NPS-2 Challenge",
    description: "10 minutes of meditation daily",
  },
  {
    id: 6,
    name: "Event Challenge",
    description: "Drink 8 glasses of water daily",
  },
  {
    id: 7,
    name: "NPS-3 Challenge",
    description: "Write 3 things you're grateful for",
  },
  {
    id: 8,
    name: "Sport Challenge",
    description: "Avoid added sugar for the day",
  },
];

const mockClasses = [
  {
    id: 1,
    name: "Leap 2b",
    challenges: [
      {
        id: 1,
        name: "Hoody Challenge",
        startDate: new Date(2024, 3, 15),
        endDate: new Date(2024, 3, 20),
      },
      {
        id: 4,
        name: "Coding Challenge",
        startDate: new Date(2024, 3, 20),
        endDate: new Date(2024, 3, 30),
      },
    ],
  },
  {
    id: 2,
    name: "Hope 1d",
    challenges: [
      {
        id: 2,
        name: "Fitness Challenge",
        startDate: new Date(2024, 3, 18),
        endDate: new Date(2024, 3, 25),
      },
    ],
  },
  {
    id: 3,
    name: "Design 2D",
    challenges: [],
  },
  {
    id: 4,
    name: "Design 2A",
    challenges: [
      {
        id: 3,
        name: "Reading Challenge",
        startDate: new Date(2024, 3, 22),
        endDate: new Date(2024, 3, 30),
      },
      {
        id: 7,
        name: "Gratitude Challenge",
        startDate: new Date(2024, 3, 25),
        endDate: new Date(2024, 3, 30),
      },
    ],
  },
  {
    id: 5,
    name: "Leap Winter 1A",
    challenges: [
      {
        id: 5,
        name: "Meditation Challenge",
        startDate: new Date(2024, 3, 17),
        endDate: new Date(2024, 3, 25),
      },
    ],
  },
];

const mockTemplates = [
  {
    id: 1,
    name: "Summer Hop Template",
    challenges: [
      { id: 1, name: "Hoody Challenge", startAfter: 15, endAfter: 20 },
      { id: 4, name: "NPS Challenge", startAfter: 0, endAfter: 10 },
    ],
  },
  {
    id: 2,
    name: "2024 Winter Leap Template",
    challenges: [
      { id: 2, name: "Hoody Challenge", startAfter: 0, endAfter: 30 },
      { id: 5, name: "Cup Challenge", startAfter: 5, endAfter: 15 },
      { id: 10, name: "NPS-1 Challenge", startAfter: 5, endAfter: 15 },
      { id: 11, name: "NPS-2 Challenge", startAfter: 5, endAfter: 15 },
    ],
  },
  {
    id: 3,
    name: "Spring Design Template",
    challenges: [
      { id: 3, name: "Sport Challenge", startAfter: 0, endAfter: 20 },
      { id: 7, name: "Game Challenge", startAfter: 10, endAfter: 20 },
    ],
  },
];

export default function Dashboard() {
  const [templates, setTemplates] = useState(mockTemplates);
  const [classes, setClasses] = useState(mockClasses);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [isAddingTemplate, setIsAddingTemplate] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);
  const [isAddingChallenge, setIsAddingChallenge] = useState(false);
  const [isAddingChallengeToClass, setIsAddingChallengeToClass] =
    useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedChallengeForTemplate, setSelectedChallengeForTemplate] =
    useState<string>("");
  const [startAfter, setStartAfter] = useState<string>("0");
  const [endAfter, setEndAfter] = useState<string>("7");

  const handleCreateTemplate = () => {
    if (newTemplateName.trim()) {
      const newTemplate = {
        id: templates.length + 1,
        name: newTemplateName,
        challenges: [],
      };
      setTemplates([...templates, newTemplate]);
      setNewTemplateName("");
      setIsAddingTemplate(false);
    }
  };

  const handleSelectTemplate = (template: any) => {
    setSelectedTemplate(template);
  };

  const handleSelectClass = (classItem: any) => {
    setSelectedClass(classItem);
  };

  const handleAddChallengeToTemplate = () => {
    if (selectedTemplate && selectedChallengeForTemplate) {
      const challengeId = Number.parseInt(selectedChallengeForTemplate);
      const challenge = mockChallenges.find((c) => c.id === challengeId);

      if (challenge) {
        const updatedTemplate = {
          ...selectedTemplate,
          challenges: [
            ...selectedTemplate.challenges,
            {
              id: challenge.id,
              name: challenge.name,
              startAfter: Number.parseInt(startAfter),
              endAfter: Number.parseInt(endAfter),
            },
          ],
        };

        setTemplates(
          templates.map((t) =>
            t.id === selectedTemplate.id ? updatedTemplate : t
          )
        );
        setSelectedTemplate(updatedTemplate);
        setIsAddingChallenge(false);
        setSelectedChallengeForTemplate("");
        setStartAfter("0");
        setEndAfter("7");
      }
    }
  };

  return (
    <div className="h-screen bg-background overflow-auto">
      <header className="sticky top-0 z-10 flex h-14 items-center border-b bg-background px-6">
        <h1 className="text-lg font-semibold">Schedule Templates Dashboard</h1>
        <div className="ml-auto flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-64 pl-8"
            />
          </div>
        </div>
      </header>

      <main className="p-6 grid grid-cols-2 gap-6">
        {/* Schedule Templates Section */}
        <Card className="p-4">
          <div className="flex items-center justify-between h-10">
            <h2 className="text-xl font-semibold">Schedule Templates</h2>
            <Dialog open={isAddingTemplate} onOpenChange={setIsAddingTemplate}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Template
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Template</DialogTitle>
                  <DialogDescription>
                    Add a new schedule template to assign challenges to classes.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Template Name</Label>
                    <Input
                      id="name"
                      value={newTemplateName}
                      onChange={(e) => setNewTemplateName(e.target.value)}
                      placeholder="e.g., Summer Fitness Program"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingTemplate(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTemplate}>
                    Create Template
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card
                key={template.id}
                className={`cursor-pointer ${
                  selectedTemplate?.id === template.id ? "border-primary" : ""
                }`}
                onClick={() => handleSelectTemplate(template)}
              >
                <CardHeader className="pb-2">
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>
                    {template.challenges.length} challenges
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-full">
                  <div className="flex flex-col justify-between h-full">
                    <div className="space-y-2">
                      {template.challenges.map((challenge: any) => (
                        <div
                          key={challenge.id}
                          className="rounded-md border p-2 text-sm"
                        >
                          <div>{challenge.name}</div>
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            <span>
                              {challenge.startAfter}-{challenge.endAfter} days
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                      <Dialog
                        open={
                          isApplyingTemplate &&
                          selectedTemplate?.id === template.id
                        }
                        onOpenChange={(open) => setIsApplyingTemplate(open)}
                      >
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsApplyingTemplate(true);
                            }}
                          >
                            Apply to Class
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Apply Template to Class</DialogTitle>
                            <DialogDescription>
                              Select a class to apply the &quot;{template.name}
                              &quot; template.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="class">Select Class</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a class" />
                                </SelectTrigger>
                                <SelectContent>
                                  {classes.map((classItem) => (
                                    <SelectItem
                                      key={classItem.id}
                                      value={classItem.id.toString()}
                                    >
                                      {classItem.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setIsApplyingTemplate(false)}
                            >
                              Cancel
                            </Button>
                            <Button>Apply Template</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedTemplate && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Edit Template: {selectedTemplate.name}</CardTitle>
                <CardDescription>
                  Add or remove challenges from this template
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">
                      Challenges in Template
                    </h3>
                    <Dialog
                      open={isAddingChallenge}
                      onOpenChange={setIsAddingChallenge}
                    >
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Challenge
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Challenge to Template</DialogTitle>
                          <DialogDescription>
                            Select a challenge to add to &quot;
                            {selectedTemplate.name}&quot;.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="challenge">Select Challenge</Label>
                            <Select
                              value={selectedChallengeForTemplate}
                              onValueChange={setSelectedChallengeForTemplate}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a challenge" />
                              </SelectTrigger>
                              <SelectContent>
                                {mockChallenges.map((challenge) => (
                                  <SelectItem
                                    key={challenge.id}
                                    value={challenge.id.toString()}
                                  >
                                    {challenge.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="startAfter">
                                Start After (days)
                              </Label>
                              <Input
                                id="startAfter"
                                type="number"
                                min="0"
                                placeholder="0"
                                value={startAfter}
                                onChange={(e) => setStartAfter(e.target.value)}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="endAfter">End After (days)</Label>
                              <Input
                                id="endAfter"
                                type="number"
                                min="0"
                                placeholder="7"
                                value={endAfter}
                                onChange={(e) => setEndAfter(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setIsAddingChallenge(false)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleAddChallengeToTemplate}>
                            Add to Template
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Separator />
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-2">
                      {selectedTemplate.challenges.map((challenge: any) => (
                        <div
                          key={challenge.id}
                          className="flex items-center justify-between rounded-md border p-3"
                        >
                          <div>
                            <div className="font-medium">{challenge.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Start after {challenge.startAfter} days, end after{" "}
                              {challenge.endAfter} days
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          )}
        </Card>

        {/* Classes Section */}
        <Card className="p-4  ">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Classes</h2>
          </div>

          <div className="grid grid-cols-[1fr_550px] gap-6">
            {/* Classes Grid */}
            <div className=" flex flex-col gap-4">
              {classes.map((classItem) => (
                <Card
                  key={classItem.id}
                  className={`p-0 cursor-pointer ${
                    selectedClass?.id === classItem.id
                      ? "border-primary"
                      : "hover:border-muted-foreground"
                  }`}
                  onClick={() => handleSelectClass(classItem)}
                >
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">
                      {classItem.name}
                    </CardTitle>
                    <CardDescription>
                      {classItem.challenges.length} challenges
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {/* Class Challenges and Calendar */}
            <div className="space-y-4">
              {/* <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card> */}

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {selectedClass
                        ? `${selectedClass.name} Challenges`
                        : "Select a Class"}
                    </CardTitle>
                    {selectedClass && (
                      <Dialog
                        open={isAddingChallengeToClass}
                        onOpenChange={setIsAddingChallengeToClass}
                      >
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <Plus className="mr-1 h-3 w-3" />
                            Add
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Challenge to Class</DialogTitle>
                            <DialogDescription>
                              Select a challenge to add to &quot;
                              {selectedClass.name}
                              &quot;.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="challenge">
                                Select Challenge
                              </Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a challenge" />
                                </SelectTrigger>
                                <SelectContent>
                                  {mockChallenges.map((challenge) => (
                                    <SelectItem
                                      key={challenge.id}
                                      value={challenge.id.toString()}
                                    >
                                      {challenge.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="date">Challenge Date</Label>
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md border"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setIsAddingChallengeToClass(false)}
                            >
                              Cancel
                            </Button>
                            <Button>Add to Class</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[300px]">
                    {selectedClass ? (
                      selectedClass.challenges.length > 0 ? (
                        <div className="space-y-1 p-3">
                          {selectedClass.challenges.map((challenge: any) => (
                            <div
                              key={challenge.id}
                              className="flex items-center justify-between rounded-md border p-2 text-sm"
                            >
                              <div>
                                <div className="font-medium">
                                  {challenge.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {challenge.startDate.toLocaleDateString()} -{" "}
                                  {challenge.endDate.toLocaleDateString()}
                                </div>
                              </div>
                              <div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0"
                                >
                                  <Pencil className="ml-1 h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-muted-foreground">
                          No challenges in this class
                        </div>
                      )
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">
                        Select a class to view challenges
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              {selectedClass && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Apply Template</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem
                            key={template.id}
                            value={template.id.toString()}
                          >
                            {template.name} ({template.challenges.length}{" "}
                            challenges)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button className="mt-2 w-full">
                      Apply Selected Template
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
