import requests
from bs4 import BeautifulSoup

def extraer_palabras_de_pagina(url):
    """
    Realiza una solicitud HTTP a la URL y extrae todas las palabras
    contenidas dentro del elemento <span class="mt">.
    """
    try:
        # Hacer la solicitud GET a la página
        response = requests.get(url, timeout=10)
        response.raise_for_status() # Lanza una excepción para códigos de estado de error (4xx o 5xx)

        # Analizar el contenido HTML
        soup = BeautifulSoup(response.content, 'html.parser')

        # El patrón se repite en la página, pero solo nos interesa el que contiene
        # la lista de palabras. El último <span class="mt"> contiene el texto grande.
        # Es más fiable buscar el span específico por su contenido.
        palabras_span = soup.find_all('span', class_='mt')

        # Asumimos que la lista de palabras está en el segundo o tercer span,
        # o buscamos el que contenga un texto muy largo.
        texto_palabras = ""
        for span in palabras_span:
            # Una heurística simple es tomar el span con la mayor cantidad de texto
            # que probablemente sea la lista de palabras.
            if len(span.text.strip()) > len(texto_palabras):
                texto_palabras = span.text.strip()

        # Separar las palabras. Están separadas por espacios.
        if texto_palabras:
            palabras = texto_palabras.split()
            return palabras
        else:
            print(f"⚠️ No se encontró el texto de palabras en la URL: {url}")
            return []

    except requests.exceptions.RequestException as e:
        print(f"❌ Error al acceder a la URL {url}: {e}")
        return []
    except Exception as e:
        print(f"❌ Ocurrió un error inesperado al procesar {url}: {e}")
        return []

def scraping_completo():
    """
    Itera sobre las 322 páginas, extrae las palabras y las guarda en un archivo.
    """
    print("▶️ Iniciando el proceso de Web Scraping...")
    
    # Definir la URL base y el rango de páginas
    base_url = "https://www.listasdepalabras.es/palabras9letraspagina"
    num_paginas = 322
    
    # La página 1 tiene un formato ligeramente diferente en la URL
    urls = [
        "https://www.listasdepalabras.es/palabras9letras.htm"
    ]
    # Agregar las URLs de la página 2 a la 322
    for i in range(2, num_paginas + 1):
        urls.append(f"{base_url}{i}.htm")

    todas_las_palabras = []
    
    # Iterar sobre todas las URLs
    for i, url in enumerate(urls, 1):
        print(f"⚙️ Procesando página {i}/{num_paginas} ({url})")
        palabras_en_pagina = extraer_palabras_de_pagina(url)
        todas_las_palabras.extend(palabras_en_pagina)
        
    print(f"✅ Extracción de datos finalizada. Se encontraron {len(todas_las_palabras)} palabras únicas.")
    
    # Guardar las palabras en un archivo de texto
    nombre_archivo = "palabras_9_letras.txt"
    try:
        with open(nombre_archivo, 'w', encoding='utf-8') as f:
            # Escribir cada palabra seguida de un salto de línea
            f.write('\n'.join(todas_las_palabras))
        
        print(f"💾 Palabras guardadas exitosamente en '{nombre_archivo}'.")
    except Exception as e:
        print(f"❌ Error al guardar el archivo: {e}")

# Ejecutar la función principal
if __name__ == "__main__":
    scraping_completo()