export interface UIField {
    managerId: string;
    widgetId: string;
    fieldId: string;
    label: string;
    _uiType: 'field';
    _uiComponent: UiComponent;
}

export interface UIWidget {
    managerId: string;
    widgetId: string;
    title: string;
    _uiType: 'widget';
}

export interface UIForm {
    managerId: string;
    _uiType: 'widgetManager';
}

export type UiType = 'field' | 'widget' | 'widgetManager';
export type UiComponent = 'input-text' | 'input-number' | 'input-select' | 'input-radio' | 'input-date' | 'input-textarea';
export type LocalesMap = Record<string, Record<string, string>>;

export type UiResource = UIField | UIWidget | UIForm;

export interface SessionState {
    sessionId: string;
    messageHistory: any[];
    uiState: Record<string, UiResource[]>;
    domainModels: Record<string, any>;
    locales: Record<string, LocalesMap>;
    createdAt: Date;
    updatedAt: Date;
}