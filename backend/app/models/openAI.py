from openai import OpenAI

client = OpenAI(
  api_key="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"
)

# Async function to request OpenAI API
async def openai_request(question, transcription):
    try:
        # Define the system role with detailed instructions for classification
        system_prompt = """
        You are an AI interview coach. Evaluate the provided response to the interview question based on the following 7 metrics:
        1. Relevance: Score (1-4) - Does the response answer the question?
        2. Structure: Score (1-4) - Does the response follow a logical format (e.g., STAR method)?
        3. Fluency: Score (1-4) - How clear and grammatically correct is the response?
        4. Delivery: Score (1-4) - Does the response sound confident and persuasive?
        5. Depth of Insight: Score (1-4) - Does the response demonstrate critical thinking and connect experiences to the job role?
        6. Conciseness: Score (1-4) - Is the response succinct and avoids unnecessary details?
        7. Impactfulness: Score (1-4) - Does the response leave a memorable impression on the interviewer?

        Provide the following outputs:
        - A classification: 1) Bad, 2) Needs Improvement, 3) Good, or 4) Excellent
        - Scores for each metric with explanations.
        - Feedback for improvement.
        - A rewritten, improved version of the response.
        """

        # Make the API call
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Question: {question}\nResponse: {transcription}"}
            ]
        )

        # Extract the AI's response
        response = completion.choices[0].message

        # Print and return the response for further processing
        print(response)
        return response

    except Exception as e:
        # Handle errors and print the issue
        print(f"Error during API call: {e}")
        return {"error": str(e)}
