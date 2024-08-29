"use client";

import React, { useState, useCallback, useMemo } from "react";
import Question from "@/components/Question";
import ArgumentSection from "@/components/ArgumentSection";
import { Button } from "@/components/ui/button";

const questions = [
  "Should the voting age be lowered to 16?",
  "Is universal basic income a viable solution to poverty?",
  "Should there be term limits for Supreme Court justices?",
  "Should college education be free for all citizens?",
  "Should the electoral college be abolished in favor of a popular vote?",
  "Should there be stricter gun control laws?",
  "Is nuclear energy a good solution for combating climate change?",
  "Should social media platforms be held responsible for user-generated content?",
  "Should the government implement a four-day work week?",
  "Should vaccination be mandatory for all citizens?",
];

const generateTopArguments = (
  questionIndex: number,
  side: "for" | "against"
) => {
  const argumentsPerQuestion = [
    {
      for: [
        { text: "Increased political engagement among youth", importance: 20 },
        {
          text: "Better representation of young people&apos;s interests",
          importance: 18,
        },
        { text: "Encourages lifelong voting habits", importance: 16 },
        { text: "Youth are affected by political decisions", importance: 14 },
        {
          text: "Aligns with other legal responsibilities at 16",
          importance: 12,
        },
      ],
      against: [
        { text: "Lack of life experience and maturity", importance: 20 },
        {
          text: "Potential for undue influence from parents or peers",
          importance: 18,
        },
        {
          text: "Incomplete brain development in decision-making areas",
          importance: 16,
        },
        { text: "May lead to lowering other age restrictions", importance: 14 },
        { text: "Possible decrease in overall voter turnout", importance: 12 },
      ],
    },
    {
      for: [
        { text: "Reduces poverty and income inequality", importance: 20 },
        { text: "Provides financial security and stability", importance: 18 },
        {
          text: "Stimulates economic growth through increased spending",
          importance: 16,
        },
        { text: "Reduces bureaucracy in welfare systems", importance: 14 },
        { text: "Supports unpaid caregivers and volunteers", importance: 12 },
      ],
      against: [
        { text: "High cost to implement and maintain", importance: 20 },
        { text: "May reduce incentive to work", importance: 18 },
        { text: "Could lead to inflation", importance: 16 },
        {
          text: "Difficulty in determining appropriate amount",
          importance: 14,
        },
        { text: "Potential for abuse or fraud", importance: 12 },
      ],
    },
    {
      for: [
        { text: "Prevents justices from serving for too long", importance: 20 },
        { text: "Allows for fresh perspectives and ideas", importance: 18 },
        {
          text: "Reduces potential for political entrenchment",
          importance: 16,
        },
        { text: "Aligns with other branches of government", importance: 14 },
        { text: "Increases public confidence in the Court", importance: 12 },
      ],
      against: [
        { text: "Threatens judicial independence", importance: 20 },
        { text: "Loses valuable experience and expertise", importance: 18 },
        { text: "May increase political pressure on justices", importance: 16 },
        {
          text: "Could lead to more frequent contentious confirmations",
          importance: 14,
        },
        {
          text: "Goes against the founders&apos; intent for lifetime appointments",
          importance: 12,
        },
      ],
    },
    {
      for: [
        { text: "Increases access to higher education", importance: 20 },
        { text: "Reduces student debt burden", importance: 18 },
        { text: "Promotes social mobility", importance: 16 },
        { text: "Boosts overall economic growth", importance: 14 },
        { text: "Creates a more educated workforce", importance: 12 },
      ],
      against: [
        { text: "High cost to taxpayers", importance: 20 },
        { text: "May decrease the value of degrees", importance: 18 },
        { text: "Potential for overcrowded universities", importance: 16 },
        { text: "Could lead to reduced education quality", importance: 14 },
        {
          text: "Unfair to those who've already paid for college",
          importance: 12,
        },
      ],
    },
    {
      for: [
        { text: "Ensures every vote has equal weight", importance: 20 },
        { text: "Increases voter turnout", importance: 18 },
        { text: "Eliminates swing state focus", importance: 16 },
        { text: "Simplifies the election process", importance: 14 },
        { text: "Better represents the will of the majority", importance: 12 },
      ],
      against: [
        { text: "Could lead to tyranny of the majority", importance: 20 },
        { text: "Diminishes the voice of smaller states", importance: 18 },
        {
          text: "May encourage campaigning only in populous areas",
          importance: 16,
        },
        { text: "Could destabilize the two-party system", importance: 14 },
        { text: "Goes against the founders' intent", importance: 12 },
      ],
    },
    {
      for: [
        { text: "Reduces gun violence", importance: 20 },
        { text: "Improves public safety", importance: 18 },
        { text: "Prevents mass shootings", importance: 16 },
        { text: "Keeps guns out of wrong hands", importance: 14 },
        { text: "Promotes responsible gun ownership", importance: 12 },
      ],
      against: [
        { text: "Infringes on Second Amendment rights", importance: 20 },
        { text: "Criminals will still obtain guns illegally", importance: 18 },
        { text: "Reduces ability for self-defense", importance: 16 },
        { text: "Punishes law-abiding gun owners", importance: 14 },
        { text: "Could lead to government overreach", importance: 12 },
      ],
    },
    {
      for: [
        { text: "Low carbon emissions", importance: 20 },
        { text: "High energy output", importance: 18 },
        { text: "Reliable baseload power", importance: 16 },
        { text: "Reduces dependence on fossil fuels", importance: 14 },
        {
          text: "Advancing nuclear technology improves safety",
          importance: 12,
        },
      ],
      against: [
        { text: "Risk of nuclear accidents", importance: 20 },
        { text: "Long-term waste storage issues", importance: 18 },
        { text: "High initial costs", importance: 16 },
        { text: "Potential for weapons proliferation", importance: 14 },
        { text: "Public fear and opposition", importance: 12 },
      ],
    },
    {
      for: [
        { text: "Reduces spread of misinformation", importance: 20 },
        { text: "Protects users from harmful content", importance: 18 },
        { text: "Encourages responsible platform management", importance: 16 },
        {
          text: "Holds companies accountable for their influence",
          importance: 14,
        },
        { text: "Promotes online safety", importance: 12 },
      ],
      against: [
        { text: "Threatens free speech", importance: 20 },
        { text: "Too much power given to platforms", importance: 18 },
        { text: "Difficult to implement fairly", importance: 16 },
        { text: "Could lead to over-censorship", importance: 14 },
        { text: "Stifles innovation and competition", importance: 12 },
      ],
    },
    {
      for: [
        { text: "Improves work-life balance", importance: 20 },
        { text: "Increases productivity", importance: 18 },
        { text: "Reduces burnout and stress", importance: 16 },
        { text: "Lowers unemployment rates", importance: 14 },
        { text: "Reduces carbon emissions from commuting", importance: 12 },
      ],
      against: [
        { text: "Potential decrease in economic output", importance: 20 },
        { text: "Not suitable for all industries", importance: 18 },
        { text: "May lead to lower wages", importance: 16 },
        { text: "Difficult transition for businesses", importance: 14 },
        { text: "Could reduce international competitiveness", importance: 12 },
      ],
    },
    {
      for: [
        { text: "Prevents spread of diseases", importance: 20 },
        { text: "Protects vulnerable populations", importance: 18 },
        { text: "Achieves herd immunity faster", importance: 16 },
        { text: "Reduces healthcare costs", importance: 14 },
        {
          text: "Eliminates misinformation-driven vaccine hesitancy",
          importance: 12,
        },
      ],
      against: [
        { text: "Infringes on personal freedom", importance: 20 },
        { text: "Raises ethical concerns", importance: 18 },
        { text: "May cause distrust in government", importance: 16 },
        { text: "Potential for adverse reactions", importance: 14 },
        { text: "Difficult to enforce universally", importance: 12 },
      ],
    },
    {
      for: [
        { text: "Increases economic opportunities", importance: 20 },
        { text: "Promotes fairness and equality", importance: 18 },
        { text: "Reduces income inequality", importance: 16 },
        { text: "Supports workers' rights", importance: 14 },
        { text: "Improves living standards", importance: 12 },
      ],
      against: [
        { text: "Potential for job loss", importance: 20 },
        { text: "May lead to inflation", importance: 18 },
        { text: "Could harm small businesses", importance: 16 },
        { text: "May increase government spending", importance: 14 },
        { text: "Could lead to wage stagnation", importance: 12 },
      ],
    },
    {
      for: [
        { text: "Promotes human dignity", importance: 20 },
        { text: "Reduces violence and crime", importance: 18 },
        { text: "Prevents wrongful convictions", importance: 16 },
        { text: "Supports rehabilitation", importance: 14 },
        { text: "Promotes justice and fairness", importance: 12 },
      ],
      against: [
        { text: "Potential for overcrowding prisons", importance: 20 },
        { text: "May lead to increased recidivism", importance: 18 },
        { text: "Could harm communities", importance: 16 },
        { text: "May increase crime rates", importance: 14 },
        { text: "Could lead to racial disparities", importance: 12 },
      ],
    },
    {
      for: [
        { text: "Supports international cooperation", importance: 20 },
        { text: "Promotes global stability", importance: 18 },
        { text: "Reduces greenhouse gas emissions", importance: 16 },
        { text: "Supports renewable energy development", importance: 14 },
        { text: "Promotes sustainable practices", importance: 12 },
      ],
      against: [
        { text: "Potential for job losses", importance: 20 },
        { text: "May increase costs for consumers", importance: 18 },
        { text: "Could harm domestic industries", importance: 16 },
        { text: "May lead to dependence on foreign countries", importance: 14 },
        { text: "Could undermine national sovereignty", importance: 12 },
      ],
    },
    {
      for: [
        { text: "Promotes personal freedom", importance: 20 },
        { text: "Increases economic opportunities", importance: 18 },
        { text: "Supports small businesses", importance: 16 },
        { text: "Encourages innovation", importance: 14 },
        { text: "Promotes entrepreneurship", importance: 12 },
      ],
      against: [
        { text: "Potential for abuse and misuse", importance: 20 },
        { text: "May lead to increased addiction", importance: 18 },
        { text: "Could harm public health", importance: 16 },
        { text: "May increase crime rates", importance: 14 },
        { text: "Could lead to social problems", importance: 12 },
      ],
    },
    {
      for: [
        { text: "Supports domestic industries", importance: 20 },
        { text: "Promotes fair trade", importance: 18 },
        { text: "Protects jobs and livelihoods", importance: 16 },
        { text: "Reduces dependence on foreign goods", importance: 14 },
        { text: "Promotes national security", importance: 12 },
      ],
      against: [
        { text: "Potential for retaliation", importance: 20 },
        { text: "May increase costs for consumers", importance: 18 },
        { text: "Could harm international relations", importance: 16 },
        { text: "May lead to job losses in other sectors", importance: 14 },
        { text: "Could undermine global economy", importance: 12 },
      ],
    },
    {
      for: [
        { text: "Promotes economic growth", importance: 20 },
        { text: "Increases revenue for government", importance: 18 },
        { text: "Supports renewable energy development", importance: 16 },
        { text: "Promotes sustainable practices", importance: 14 },
        { text: "Reduces greenhouse gas emissions", importance: 12 },
      ],
      against: [
        { text: "Potential for increased costs", importance: 20 },
        { text: "May harm small businesses", importance: 18 },
        { text: "Could lead to job losses", importance: 16 },
        { text: "May increase government spending", importance: 14 },
        { text: "Could undermine free market principles", importance: 12 },
      ],
    },
    {
      for: [
        { text: "Promotes renewable energy development", importance: 20 },
        { text: "Supports sustainable practices", importance: 18 },
        { text: "Reduces greenhouse gas emissions", importance: 16 },
        { text: "Promotes economic growth", importance: 14 },
        { text: "Creates jobs and opportunities", importance: 12 },
      ],
      against: [
        { text: "Potential for increased costs", importance: 20 },
        { text: "May harm small businesses", importance: 18 },
        { text: "Could lead to job losses", importance: 16 },
        { text: "May increase government spending", importance: 14 },
        { text: "Could undermine free market principles", importance: 12 },
      ],
    },
    {
      for: [
        { text: "Addresses social issues", importance: 20 },
        { text: "Promotes community engagement", importance: 18 },
        { text: "Supports underprivileged populations", importance: 16 },
        { text: "Promotes social mobility", importance: 14 },
        { text: "Improves living standards", importance: 12 },
      ],
      against: [
        { text: "Potential for government overreach", importance: 20 },
        { text: "May lead to dependency", importance: 18 },
        { text: "Could harm individual initiative", importance: 16 },
        { text: "May increase government spending", importance: 14 },
        { text: "Could undermine free market principles", importance: 12 },
      ],
    },
  ];

  return argumentsPerQuestion[questionIndex][side];
};

type Argument = { id: string; text: string; importance: number };
type ArgumentState = {
  for: Argument[];
  against: Argument[];
  topArgumentsAdded: boolean;
};

export default function Home() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [forArguments, setForArguments] = useState<
    Array<{ id: string; text: string; importance: number }>
  >([]);
  const [againstArguments, setAgainstArguments] = useState<
    Array<{ id: string; text: string; importance: number }>
  >([]);
  const [topArgumentsAdded, setTopArgumentsAdded] = useState(false);

  const nextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
    setForArguments([]);
    setAgainstArguments([]);
    setTopArgumentsAdded(false);
  };

  const addTopArguments = useCallback(() => {
    if (topArgumentsAdded) return;

    const topForArgs = generateTopArguments(currentQuestionIndex, "for").map(
      (arg) => ({
        ...arg,
        importance: 0,
        id: `for-${Date.now()}-${Math.random()}`,
      })
    );
    const topAgainstArgs = generateTopArguments(
      currentQuestionIndex,
      "against"
    ).map((arg) => ({
      ...arg,
      importance: 0,
      id: `against-${Date.now()}-${Math.random()}`,
    }));

    setForArguments((prev) => {
      const newArgs = [...prev, ...topForArgs];
      return newArgs.slice(0, 10);
    });
    setAgainstArguments((prev) => {
      const newArgs = [...prev, ...topAgainstArgs];
      return newArgs.slice(0, 10);
    });

    setTopArgumentsAdded(true);
  }, [currentQuestionIndex, topArgumentsAdded]);

  const calculateTotalPercentage = useCallback(
    (args: Argument[] | undefined) => {
      if (!args || !Array.isArray(args)) {
        return 0;
      }
      return args.reduce((sum, arg) => sum + arg.importance, 0);
    },
    []
  );

  const totalPercentage = useMemo(
    () =>
      calculateTotalPercentage(forArguments) +
      calculateTotalPercentage(againstArguments),
    [forArguments, againstArguments, calculateTotalPercentage]
  );

  const updateArguments = useCallback(
    (newArgs: Argument[], isFor: boolean) => {
      const otherArgs = isFor ? againstArguments : forArguments;
      const newTotalPercentage =
        calculateTotalPercentage(newArgs) + calculateTotalPercentage(otherArgs);

      if (newTotalPercentage > 100) {
        const scale = 100 / newTotalPercentage;
        newArgs = newArgs.map((arg) => ({
          ...arg,
          importance: Math.round(arg.importance * scale),
        }));
        otherArgs.forEach((arg) => {
          arg.importance = Math.round(arg.importance * scale);
        });
      }

      if (isFor) {
        setForArguments(newArgs);
        setAgainstArguments([...otherArgs]);
      } else {
        setAgainstArguments(newArgs);
        setForArguments([...otherArgs]);
      }
    },
    [forArguments, againstArguments, calculateTotalPercentage]
  );

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-24 bg-background text-foreground">
      <Question text={questions[currentQuestionIndex]} />
      <div className="flex flex-col md:flex-row w-full mt-8 space-y-8 md:space-y-0 md:space-x-8">
        <ArgumentSection
          title="Arguments For"
          arguments={forArguments}
          setArguments={(newArgs) => updateArguments(newArgs, true)}
          totalPercentage={totalPercentage}
          isFor={true}
          droppableId="for"
        />
        <ArgumentSection
          title="Arguments Against"
          arguments={againstArguments}
          setArguments={(newArgs) => updateArguments(newArgs, false)}
          totalPercentage={totalPercentage}
          isFor={false}
          droppableId="against"
        />
      </div>
      <div className="flex flex-col sm:flex-row justify-center items-center mt-8 w-full space-y-4 sm:space-y-0 sm:space-x-4">
        <Button
          onClick={addTopArguments}
          variant="outline"
          className="w-full sm:w-auto"
          disabled={topArgumentsAdded}
        >
          Add Top 5 Arguments
        </Button>
        <Button
          onClick={nextQuestion}
          variant="default"
          className="w-full sm:w-auto"
        >
          Next Question
        </Button>
      </div>
    </main>
  );
}
