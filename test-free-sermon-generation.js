// Test the free sermon generation function directly
function generateStructuredSermon({ topic, scripture, audience, duration, language }) {
  const audienceText = audience ? ` para ${audience}` : ''
  const scriptureText = scripture ? ` basado en ${scripture}` : ''
  const durationText = duration ? ` de ${duration} minutos` : ''
  
  const sermonTemplate = `# SERMÓN REFORMADO: ${topic.toUpperCase()}
${scriptureText ? `**Texto Base:** ${scripture}` : ''}
**Audiencia:** ${audience || 'Congregación general'}
**Duración:** ${duration || '30'} minutos
**Enfoque:** Teología del Pacto Reformada

---

## 1. INTRODUCCIÓN

**Ilustración de apertura:**
${scripture ? `El pasaje de ${scripture} nos enseña una verdad fundamental sobre` : 'Cuando consideramos el tema de'} ${topic.toLowerCase()}, debemos recordar que estamos viendo este asunto a través del lente de la gracia soberana de Dios. En nuestro contexto actual, muchas personas buscan ${topic.toLowerCase()} de maneras que no honran a Dios.

**Conexión con la vida cotidiana:**
${audienceText} Vivimos en un mundo que constantemente nos desafía en cuanto a ${topic.toLowerCase()}. La perspectiva bíblica nos ofrece no solo entendimiento, sino también esperanza fundada en las promesas del pacto de gracia.

**Propósito del sermón:**
Hoy examinaremos lo que las Escrituras enseñan sobre ${topic.toLowerCase()}, cómo esto se relaciona con el pacto de gracia, y cómo podemos aplicar estas verdades en nuestra vida diaria para la gloria de Dios.

---

## 2. CONTEXTO BÍBLICO Y PACTUAL

**Trasfondo histórico:**
${scripture ? `El pasaje de ${scripture} fue escrito en un contexto específico que` : 'El tema de'} ${topic.toLowerCase()} tiene raíces profundas en la revelación progresiva de Dios. Desde Génesis hasta Apocalipsis, vemos cómo Dios ha trabajado a través de sus pactos para revelar su voluntad concerniente a este tema.

**Ubicación en el pacto de gracia:**
En el marco de la teología del pacto, entendemos que ${topic.toLowerCase()} no es simplemente un concepto aislado, sino que forma parte del gran plan redentor de Dios. Cristo, como mediador del nuevo pacto, cumple perfectamente todo lo que este tema requiere.

**Conexión cristológica:**
${scripture ? `En ${scripture}, vemos` : 'En relación con'} ${topic.toLowerCase()}, Cristo se presenta como nuestro ejemplo perfecto y nuestro salvador suficiente. Él no solo nos muestra cómo vivir en esta área, sino que también nos capacita mediante su Espíritu.

---

## 3. PUNTOS PRINCIPALES

### **PUNTO 1: LA PERSPECTIVA DE DIOS SOBRE ${topic.toUpperCase()}**

**Explicación bíblica:**
Las Escrituras nos enseñan que Dios tiene un diseño perfecto para ${topic.toLowerCase()}. Su voluntad revelada en su Palabra nos muestra no solo lo que debemos hacer, sino también por qué es importante para nuestro crecimiento espiritual y su gloria.

Desde una perspectiva reformada, entendemos que nuestra comprensión de ${topic.toLowerCase()} debe estar fundamentada en la autoridad de las Escrituras (Sola Scriptura) y aplicada por la gracia de Dios (Sola Gratia).

**Aplicación práctica:**
En la vida diaria, esto significa que nuestras decisiones concernientes a ${topic.toLowerCase()} deben ser guiadas por principios bíblicos, no por la sabiduría mundana o nuestros propios sentimientos.

**Ilustración:**
Piense en un navegador GPS que nos guía por el camino correcto. De la misma manera, la Palabra de Dios actúa como nuestro GPS espiritual en el área de ${topic.toLowerCase()}.

### **PUNTO 2: NUESTRA RESPUESTA COMO PUEBLO DEL PACTO**

**Explicación bíblica:**
Como creyentes que han sido incluidos en el pacto de gracia, tenemos tanto el privilegio como la responsabilidad de responder correctamente a las enseñanzas de Dios sobre ${topic.toLowerCase()}. Esta respuesta fluye de corazones regenerados por el Espíritu Santo.

La santificación progresiva significa que crecemos gradualmente en nuestro entendimiento y aplicación de ${topic.toLowerCase()} a medida que el Espíritu Santo obra en nosotros.

**Aplicación práctica:**
Esto requiere disciplinas espirituales como la oración, el estudio bíblico, la comunión fraternal, y la obediencia práctica en las áreas donde Dios nos ha dado luz.

**Ilustración:**
Como un músculo que se fortalece con el ejercicio constante, nuestra capacidad para honrar a Dios en ${topic.toLowerCase()} se desarrolla con la práctica fiel y dependencia del Espíritu Santo.

### **PUNTO 3: LA GLORIA DE DIOS COMO META FINAL**

**Explicación bíblica:**
El propósito último de toda enseñanza bíblica, incluyendo lo que aprendemos sobre ${topic.toLowerCase()}, es la gloria de Dios (Soli Deo Gloria). Nuestra obediencia en esta área no es principalmente para nuestro beneficio, sino para demostrar la grandeza y bondad de nuestro Dios.

Cuando vivimos según los principios bíblicos relacionados con ${topic.toLowerCase()}, estamos declarando al mundo que Dios es digno de confianza y que sus caminos son perfectos.

**Aplicación práctica:**
Pregúntese: "¿Cómo puedo honrar a Dios en mi manejo de ${topic.toLowerCase()}?" Esta pregunta debe guiar nuestras decisiones y acciones en esta área.

**Ilustración:**
Como un espejo que refleja la luz del sol, nuestras vidas deben reflejar la gloria de Dios en cada aspecto, incluyendo ${topic.toLowerCase()}.

---

## 4. CONCLUSIÓN REFORMADA

**Resumen dentro del marco del pacto:**
Hemos visto que ${topic.toLowerCase()} no es un tema periférico en la vida cristiana, sino que está íntimamente conectado con el pacto de gracia y la obra redentora de Cristo. Dios ha provisto todo lo que necesitamos para vivir de manera que le agrade en esta área.

**Exaltación de la gracia soberana:**
Recordemos que cualquier progreso que hagamos en ${topic.toLowerCase()} es resultado de la gracia de Dios operando en nosotros. No dependemos de nuestras propias fuerzas, sino del poder del Espíritu Santo que habita en nosotros.

**Llamado a la fe y obediencia:**
Por tanto, comprometámonos a buscar la voluntad de Dios en ${topic.toLowerCase()} con renovada determinación. Que nuestra obediencia fluya de corazones agradecidos por lo que Cristo ha hecho por nosotros.

**Aplicación práctica de la santificación:**
Esta semana, identifique una manera específica en que puede aplicar lo que hemos aprendido sobre ${topic.toLowerCase()}. Ore pidiendo la ayuda del Espíritu Santo y busque la responsabilidad de hermanos en la fe.

**Oración pastoral final:**
*"Padre celestial, te agradecemos por tu Palabra que nos guía en todas las áreas de la vida, incluyendo ${topic.toLowerCase()}. Ayúdanos a vivir de manera que te honre y glorifique tu nombre. Que el Espíritu Santo nos capacite para ser fieles en esta área para tu gloria y el bien de otros. En el nombre de Jesús, Amén."*

---

## 5. ESQUEMA ESTRUCTURAL

**Tema Central:** ${topic}
${scripture ? `**Texto Principal:** ${scripture}` : ''}

**Puntos Principales:**
1. La Perspectiva de Dios sobre ${topic}
2. Nuestra Respuesta como Pueblo del Pacto  
3. La Gloria de Dios como Meta Final

**Aplicación Clave:** Vivir ${topic.toLowerCase()} de manera que honre a Dios y refleje nuestra identidad como pueblo del pacto de gracia.

**Enfoque Teológico:** Sola Scriptura • Sola Gratia • Sola Fide • Solus Christus • Soli Deo Gloria

---

*Este sermón ha sido estructurado según principios de Teología del Pacto Reformada${durationText ? ` para una duración aproximada${durationText}` : ''}. Se recomienda adaptar los ejemplos y aplicaciones según el contexto específico de la congregación.*`

  return sermonTemplate
}

// Test the generation
const testSermon = generateStructuredSermon({
  topic: "La gracia de Dios",
  scripture: "Efesios 2:8-9",
  audience: "general",
  duration: "30",
  language: "es"
})

console.log("=== SERMÓN GENERADO ===")
console.log(testSermon)
console.log("\n=== FIN DEL SERMÓN ===")
console.log("Longitud del sermón:", testSermon.length, "caracteres")
console.log("Contiene estructura esperada:", testSermon.includes("INTRODUCCIÓN") && testSermon.includes("CONCLUSIÓN"))