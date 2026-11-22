---

title: "Usa as imagens do Gemini no Arrumo"
description: "Nas definições do Arrumo, abre o plugin do Gemini e guarda uma chave de API no campo secreto."
---

Nas definições do Arrumo, abre o plugin do Gemini e guarda uma chave de API no campo secreto. A chave do espaço de trabalho tem prioridade sobre a da aplicação; o Arrumo guarda ambas no cofre de credenciais do sistema e nunca as mostra aos agentes.

Quando um formato pede miniaturas, o agente da execução escreve uma instrução por miniatura e o Arrumo pede-as aos fornecedores de imagens pela ordem guardada na execução. O Gemini é ignorado se não tiver chave. As miniaturas ficam guardadas como recursos do espaço de trabalho e aguardam a tua revisão com os títulos e descrições.

## Escolhe o modelo

O plugin usa `gemini-2.5-flash-image` por omissão. Para usar um modelo mais recente, define **Modelo de imagem** nas definições do plugin para a aplicação ou um espaço de trabalho. Deixa vazio para seguir o modelo predefinido do plugin.
