"use client";

import React, { JSX } from "react";
import { Topic } from "@/proto/janus/plato/object_pb";
import Link from "next/link";

type Props = {
  topic: Topic;
  redirect: string;
};

export function AdminTopicCard({ topic, redirect }: Props): JSX.Element {
  return (
    <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-2xl shadow-md transition hover:shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900">{topic.title}</h2>
      <p className="mt-2 text-gray-600">{topic.description}</p>
      <Link
        href={redirect}
        className="mt-4 inline-block px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label={`Edit topic: ${topic.title}`}
      >
        Edit Topic
      </Link>
    </div>
  );
}
