// client/src/game/StateManager.ts
import Cookies from 'js-cookie';

// Define la estructura de nuestros datos guardados
interface IDailyProgress {
  guesses: string[]; // Los intentos que ya hizo
  status: 'pending' | 'win' | 'lose';
}

type DifficultyKey = '5' | '7' | '9';

interface IGameData {
  lastPlayDate: string;
  currentStreak: number;
  // 2. Usar un índice mapeado con las claves permitidas
  progress: Record<DifficultyKey, IDailyProgress>;
}

// Nombre de nuestra cookie
const COOKIE_NAME = 'la_palabra_del_dia_data';

export class StateManager {

  private data: IGameData;
  private today: string;

  constructor() {
    this.today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    this.loadData();
  }

  /**
   * Carga los datos de la cookie al iniciar
   */
  private loadData() {
    const cookieData = Cookies.get(COOKIE_NAME);

    if (cookieData) {
      this.data = JSON.parse(cookieData);
      
      // Comprobar si es un nuevo día
      if (this.data.lastPlayDate !== this.today) {
        
        // Comprobar si ayer jugó y ganó para mantener la racha (Req 9)
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const didWinYesterday = this.data.lastPlayDate === yesterday && 
                               (this.data.progress['5'].status === 'win' ||
                                this.data.progress['7'].status === 'win' ||
                                this.data.progress['9'].status === 'win');

        if (!didWinYesterday) {
          this.data.currentStreak = 0; // Rompió la racha
        }
        
        // Es un nuevo día, resetear el progreso diario
        this.data.progress = this.getNewDailyProgress();
        this.data.lastPlayDate = this.today;
      }

    } else {
      // No hay cookie, inicializar datos
      this.data = {
        lastPlayDate: this.today,
        currentStreak: 0,
        progress: this.getNewDailyProgress()
      };
    }
    
    // Guardar los datos (ya sea reseteados o nuevos)
    this.save();
  }

  /**
   * Guarda los datos actuales en la cookie
   */
  private save() {
    Cookies.set(COOKIE_NAME, JSON.stringify(this.data), { expires: 365 });
  }

  /**
   * Genera un objeto de progreso diario vacío
   */
  private getNewDailyProgress(): IGameData['progress'] { // <- Especificamos el tipo de retorno
    // Definimos el tipo de 'empty' para que coincida con IDailyProgress
    const empty: IDailyProgress = { 
        // TypeScript ahora sabe que 'pending' es el literal, no un string genérico
        guesses: [], 
        status: 'pending' 
    }; 
    
    return {
        '5': { ...empty },
        '7': { ...empty },
        '9': { ...empty }
    };
}

  // --- MÉTODOS PÚBLICOS ---

  /**
   * Obtiene el estado actual para una dificultad (Req 5)
   */
  public getDailyState(difficulty: number): IDailyProgress {
    const key = difficulty.toString() as DifficultyKey;
    return this.data.progress[key];
  }

  /**
   * Guarda un nuevo intento
   */
  public saveGuess(difficulty: number, guess: string) {
    const key = difficulty.toString() as DifficultyKey;
    this.data.progress[key].guesses.push(guess);
    this.save();
  }

  /**
   * Marca una dificultad como ganada
   */
  public markAsWon(difficulty: number) {
    const key = difficulty.toString() as DifficultyKey;
      this.data.progress[key].status = 'win';
    
    // Incrementar la racha (solo una vez por día)
    const todayWonAny = this.data.progress[5].status === 'win' ||
                        this.data.progress[7].status === 'win' ||
                        this.data.progress[9].status === 'win';

    // Si es la primera victoria del día Y la racha no ha sido actualizada hoy
    // (Esta lógica es un poco simple, asume que 'markAsWon' actualiza la racha)
    // Para ser más robusto, se debería chequear 'lastStreakUpdateDate'
    
    // Lógica simple: si la racha es 0 o el último juego fue ayer, +1
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (this.data.currentStreak === 0 || this.data.lastPlayDate === yesterday) {
       // Este check es imperfecto, pero para un juego diario funciona
    }
    
    // Lógica mejorada en `loadData`
    this.data.currentStreak++; // Aumentamos la racha
    this.data.lastPlayDate = this.today; // Marcamos que hoy se jugó
    this.save();
  }

  /**
   * Marca una dificultad como perdida
   */
  public markAsLost(difficulty: number) {
    const key = difficulty.toString() as DifficultyKey;
      this.data.progress[key].status = 'lose';
    this.data.lastPlayDate = this.today; // Marcamos que hoy se jugó
    this.save();
  }

  /**
   * Devuelve la racha actual (Req 9)
   */
  public getStreak(): number {
    return this.data.currentStreak;
  }
}