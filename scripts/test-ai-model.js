import { pipeline } from "@xenova/transformers"

async function testModel() {
  console.log("🤖 Probando modelo de IA en español...")

  try {
    console.log("📥 Cargando modelo PlanTL-GOB-ES/gpt2-base-bne...")

    const generator = await pipeline("text-generation", "PlanTL-GOB-ES/gpt2-base-bne")

    console.log("✅ Modelo cargado correctamente!")

    const testPrompts = ["Hola, ¿cómo estás?", "¿Qué es la inteligencia artificial?", "Cuéntame sobre España"]

    for (const prompt of testPrompts) {
      console.log(`\n🔤 Probando: "${prompt}"`)

      const result = await generator(`Usuario: ${prompt}\nAsistente:`, {
        max_new_tokens: 50,
        temperature: 0.7,
        do_sample: true,
        top_p: 0.9,
      })

      const response = result[0].generated_text.replace(`Usuario: ${prompt}\nAsistente:`, "").trim()
      console.log(`💬 Respuesta: ${response}`)
    }

    console.log("\n🎉 ¡Modelo funcionando correctamente!")
  } catch (error) {
    console.error("❌ Error probando el modelo:", error)
  }
}

testModel()
