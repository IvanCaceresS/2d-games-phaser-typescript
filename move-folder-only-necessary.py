import os
import shutil
from pathlib import Path
from typing import Callable, List
import gitignorefile 

# --- Configuración ---
SOURCE_DIR_REL = "wordle"
DEST_DIR_REL = "C:/Users/icace/Downloads/wordle"
# ---------------------

def get_gitignore_ignore_func(source_dir: Path) -> Callable[[str, List[str]], List[str]]:
    return gitignorefile.ignore()

def copy_folder_with_gitignore_rules(source: str, destination: str):
    source_path = Path(source)
    destination_path = Path(destination)
    
    if not source_path.is_dir():
        print(f"ERROR: La ruta de origen no es una carpeta o no existe: {source_path}")
        return

    print(f"Iniciando copia de: '{source_path}' a '{destination_path}'")
    
    ignore_func = get_gitignore_ignore_func(source_path)

    try:
        shutil.copytree(
            src=str(source_path), 
            dst=str(destination_path), 
            ignore=ignore_func,
            dirs_exist_ok=False 
        )

        print("¡Copia completada con éxito!")
        print("Los archivos y carpetas listados en los .gitignore han sido ignorados.")
        
    except FileExistsError:
        print(f"ERROR: La carpeta de destino ya existe: {destination_path}. La operación se ha cancelado.")
    except Exception as e:
        print(f"Ocurrió un error durante la operación: {e}")


if __name__ == "__main__":
    copy_folder_with_gitignore_rules(SOURCE_DIR_REL, DEST_DIR_REL)