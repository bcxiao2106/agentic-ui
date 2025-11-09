export class SessionStateService {
  // Stubbed in-memory store for now to avoid external deps
  private store: Record<string, any> = {};

  async getState(sessionId: string) {
    return this.store[sessionId] ?? null;
  }

  async updateState(sessionId: string, partial: object) {
    const cur = this.store[sessionId] ?? {};
    this.store[sessionId] = { ...cur, ...partial };
    return this.store[sessionId];
  }

  async diffState(sessionId: string, newState: object) {
    const cur = this.store[sessionId] ?? {};
    // naive diff: list keys that changed
    const changes: Record<string, any> = {};
    for (const k of Object.keys(newState as any)) {
      if ((cur as any)[k] !== (newState as any)[k]) changes[k] = { before: (cur as any)[k], after: (newState as any)[k] };
    }
    return { changes };
  }
}
