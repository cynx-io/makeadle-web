import { topicServerClient } from "@/lib/janus/server-client/plato";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const topics = await topicServerClient.listTopicsByUserId({});
    return NextResponse.json(topics);
  } catch (error) {
    console.error("Topics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch topics" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await topicServerClient.insertTopic(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Create topic API error:", error);
    return NextResponse.json(
      { error: "Failed to create topic" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await topicServerClient.updateTopic(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Update topic API error:", error);
    return NextResponse.json(
      { error: "Failed to update topic" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Topic ID required" }, { status: 400 });
    }
    const result = await topicServerClient.deleteTopic({ id });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Delete topic API error:", error);
    return NextResponse.json(
      { error: "Failed to delete topic" },
      { status: 500 },
    );
  }
}
