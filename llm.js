// backend/llm.js

// Predefined visualization JSONs
const visNewton = {
  id: "vis_newton",
  duration: 4000,
  fps: 30,
  layers: [
    {
      id: "ball",
      type: "circle",
      props: { x: 100, y: 200, r: 20, fill: "#3498db" },
      animations: [{ property: "x", from: 100, to: 400, start: 0, end: 3000 }],
    },
    {
      id: "arrow",
      type: "arrow",
      props: { x: 90, y: 200, dx: 30, dy: 0, color: "#e74c3c" },
      animations: [],
    },
  ],
};

const visPhotosynthesis = {
  id: "vis_photosynthesis",
  duration: 5000,
  fps: 30,
  layers: [
    { id: "sun", type: "circle", props: { x: 300, y: 100, r: 40, fill: "#f1c40f" }, animations: [] },
    { id: "plant", type: "rectangle", props: { x: 280, y: 300, width: 40, height: 80, fill: "#2ecc71" }, animations: [] },
    { id: "sunray", type: "line", props: { x1: 300, y1: 100, x2: 300, y2: 300, stroke: "#f39c12", strokeWidth: 2 },
      animations: [{ property: "opacity", from: 0, to: 1, start: 0, end: 2000 }],
    },
  ],
};

const visSolar = {
  id: "vis_solar",
  duration: 6000,
  fps: 30,
  layers: [
    { id: "sun", type: "circle", props: { x: 300, y: 300, r: 40, fill: "#f39c12" }, animations: [] },
    { id: "earth", type: "circle", props: { x: 200, y: 300, r: 15, fill: "#3498db" },
      animations: [{ property: "orbit", centerX: 300, centerY: 300, radius: 100, duration: 6000 }],
    },
    { id: "mars", type: "circle", props: { x: 150, y: 300, r: 12, fill: "#e74c3c" },
      animations: [{ property: "orbit", centerX: 300, centerY: 300, radius: 150, duration: 8000 }],
    },
  ],
};

// Main function to create answer + visualization
export async function createQuestionAnswer(question, answerId) {
  let text = "";
  let visualization = {};

  const q = question.toLowerCase();

  if (q.includes("newton")) {
    text = "Newton’s First Law states that an object will remain at rest or in uniform motion in a straight line unless acted upon by an external force.";
    visualization = visNewton;
  } else if (q.includes("photosynthesis")) {
    text = "Photosynthesis is the process by which green plants use sunlight, carbon dioxide, and water to produce glucose (food) and oxygen.";
    visualization = visPhotosynthesis;
  } else if (q.includes("solar system")) {
    text = "The Solar System consists of the Sun at the center with planets orbiting around it due to gravitational pull.";
    visualization = visSolar;
  } else {
    // Generic fallback
    text = `Here’s a simple explanation for: ${question}`;
    visualization = { id: "vis_generic", duration: 2000, fps: 30, layers: [] };
  }

  return {
    id: answerId,
    text,
    visualization,
  };
}

// import OpenAI from "openai";
// import dotenv from "dotenv";

// dotenv.config();

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });


// export async function createQuestionAnswer(question, answerId) {
//   const response = await client.responses.create({
//     model: "gpt-4o-mini", // or "gpt-4.1-mini"
//     input: `
//     The user asked: "${question}"

//     Please return only valid JSON in this format:
//     {
//       "text": "<clear explanation in simple language>",
//       "visualization": {
//         "id": "vis_001",
//         "duration": 4000,
//         "fps": 30,
//         "layers": []
//       }
//     }
//     `,
//   });

//   let parsed;
//   try {
//     parsed = JSON.parse(response.output_text);
//   } catch (e) {
//     parsed = {
//       text: response.output_text, 
//       visualization: {
//         id: "vis_generic",
//         duration: 2000,
//         fps: 30,
//         layers: [],
//       },
//     };
//   }

//   return {
//     id: answerId,
//     ...parsed,
//   };
// }
