import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  KeyRound, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  X,
  Building2,
  UserCheck,
  Sparkles
} from 'lucide-react';
import { 
  validatePasswordRule, 
  saveUserCredentialsToSupabase, 
  findAffiliateByIdentifier, 
  findBoardMemberByIdentifier 
} from '../lib/authCredentialsSync';

export function PasswordManagementModal({
  isOpen,
  onClose,
  userType = 'affiliate', // 'affiliate' | 'board'
  initialIdentifier = '',
  currentUser = null, // If provided, user is already logged in (Self-Management mode)
  onSuccess = null
}) {
  const [step, setStep] = useState(currentUser ? 2 : 1);
  const [identifier, setIdentifier] = useState(initialIdentifier || '');
  const [foundAccount, setFoundAccount] = useState(currentUser || null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsCompleted(false);
      setSaveError('');
      setSearchError('');
      setNewPassword('');
      setConfirmPassword('');
      if (currentUser) {
        setFoundAccount(currentUser);
        setStep(2);
      } else {
        setStep(1);
        setIdentifier(initialIdentifier || '');
        setFoundAccount(null);
      }
    }
  }, [isOpen, currentUser, initialIdentifier]);

  if (!isOpen) return null;

  // Handle Account Identification
  const handleVerifyAccount = async (e) => {
    e.preventDefault();
    setSearchError('');
    if (!identifier.trim()) {
      setSearchError('Por favor ingrese su correo electrónico, código o RIF.');
      return;
    }

    setIsSearching(true);
    try {
      if (userType === 'board') {
        const boardMember = findBoardMemberByIdentifier(identifier);
        if (boardMember) {
          setFoundAccount({
            name: boardMember.name,
            role: boardMember.role,
            email: boardMember.email,
            aliases: boardMember.aliases || [],
            isBoard: true
          });
          setStep(2);
        } else {
          setSearchError('No se encontró ningún miembro directivo con los datos proporcionados.');
        }
      } else {
        const affiliate = await findAffiliateByIdentifier(identifier);
        if (affiliate) {
          setFoundAccount({
            name: affiliate.nombre_establecimiento || affiliate.nombre_comercial,
            owner: affiliate.representante_legal || affiliate.titular_propietario,
            code: affiliate.codigo_afiliado,
            email: affiliate.email,
            rif: affiliate.rif_cedula,
            isBoard: false
          });
          setStep(2);
        } else {
          setSearchError('No se encontró ningún agremiado registrado con ese correo, código o RIF.');
        }
      }
    } catch (err) {
      setSearchError('Error al consultar el registro. Por favor intente nuevamente.');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle Password Save
  const handleSavePassword = async (e) => {
    e.preventDefault();
    setSaveError('');

    const validation = validatePasswordRule(newPassword);
    if (!validation.valid) {
      setSaveError(validation.message);
      return;
    }

    if (newPassword !== confirmPassword) {
      setSaveError('Las contraseñas no coinciden. Por favor verifíquelas.');
      return;
    }

    setIsSaving(true);
    try {
      let primaryKey = '';
      let additionalKeys = [];

      if (userType === 'board' || foundAccount?.isBoard) {
        primaryKey = foundAccount?.email || identifier;
        additionalKeys = [
          foundAccount?.email,
          ...(foundAccount?.aliases || []),
          identifier
        ];
      } else {
        primaryKey = foundAccount?.email || foundAccount?.code || identifier;
        additionalKeys = [
          foundAccount?.email,
          foundAccount?.code,
          foundAccount?.codigo_afiliado,
          foundAccount?.id,
          foundAccount?.rif,
          foundAccount?.rif_cedula,
          identifier
        ];
      }

      await saveUserCredentialsToSupabase(primaryKey, newPassword, additionalKeys);

      setIsCompleted(true);
      if (onSuccess) {
        onSuccess({
          identifier: primaryKey,
          newPassword: newPassword.trim(),
          account: foundAccount
        });
      }

      setTimeout(() => {
        onClose();
      }, 2500);

    } catch (err) {
      setSaveError(err.message || 'Error al guardar la nueva contraseña en Supabase.');
    } finally {
      setIsSaving(false);
    }
  };

  const isSelfManage = !!currentUser;
  const passwordLength = newPassword.trim().length;
  const isLengthValid = passwordLength >= 8;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-scaleUp">
        
        {/* Header Decorator */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 p-6 text-slate-950 relative">
          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 p-2 rounded-full bg-black/10 hover:bg-black/20 text-slate-950 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-slate-950 shadow-inner">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-950/80 bg-white/30 px-2 py-0.5 rounded-full inline-block mb-1">
                {isSelfManage ? 'Autogestión de Seguridad' : 'Recuperación de Acceso'}
              </span>
              <h3 className="text-lg font-serif font-black tracking-tight leading-tight">
                {isSelfManage 
                  ? 'Cambiar Mi Clave de Acceso' 
                  : (userType === 'board' ? 'Recuperar Clave Directiva' : 'Recuperar Clave de Agremiado')}
              </h3>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {isCompleted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-900 font-serif">
                ¡Contraseña Actualizada con Éxito!
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed px-4">
                Su nueva clave de acceso ha sido registrada de inmediato en la bóveda de seguridad en Supabase Cloud. Ya puede ingresar en cualquier momento.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold font-serif uppercase tracking-wider shadow transition-all"
                >
                  Continuar
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Step 1: Account Lookup (Only if not already authenticated) */}
              {step === 1 && (
                <form onSubmit={handleVerifyAccount} className="space-y-4">
                  <div className="text-xs text-slate-600 leading-relaxed">
                    Ingrese su correo electrónico registrado, código de afiliado o RIF para validar su cuenta en la plataforma:
                  </div>

                  {searchError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{searchError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {userType === 'board' ? 'Correo Directivo / Institucional' : 'Correo, Código CGM o RIF'}
                    </label>
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={userType === 'board' ? 'ej: directivo@camara... o correo personal' : 'ej: contacto@empresa.com o CGM-2026-000'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white bg-slate-50 transition-all"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSearching}
                      className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-serif font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>{isSearching ? 'Verificando en Supabase...' : 'Verificar Mi Cuenta'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* Step 2: Set New Password */}
              {step === 2 && (
                <form onSubmit={handleSavePassword} className="space-y-4">
                  
                  {/* Account Summary Badge */}
                  {foundAccount && (
                    <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-1">
                      <div className="flex items-center gap-2 font-bold text-amber-950 font-serif">
                        <Building2 className="w-4 h-4 text-amber-600 shrink-0" />
                        <span className="truncate">
                          {foundAccount.name || foundAccount.restaurantName || foundAccount.role || 'Usuario Validado'}
                        </span>
                      </div>
                      <div className="text-[11px] text-amber-900/80 truncate pl-6">
                        {foundAccount.code || foundAccount.email || foundAccount.id || ''}
                      </div>
                    </div>
                  )}

                  {/* Single statutory requirement notice */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <span><strong>Condición única:</strong> Mínimo 8 caracteres (números, letras o combinados).</span>
                  </div>

                  {saveError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{saveError}</span>
                    </div>
                  )}

                  {/* New Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700">
                        Nueva Contraseña
                      </label>
                      <span className={`text-[10px] font-bold ${isLengthValid ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {passwordLength}/8 caracteres
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Mínimo 8 caracteres"
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white bg-slate-50 transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Confirmar Nueva Contraseña
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repita la nueva contraseña"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white bg-slate-50 transition-all font-mono"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center gap-2">
                    {!isSelfManage && (
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-4 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold"
                      >
                        Atrás
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isSaving || !isLengthValid}
                      className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-serif font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] disabled:opacity-40"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>{isSaving ? 'Guardando en Supabase...' : 'Guardar y Actualizar Clave'}</span>
                    </button>
                  </div>

                </form>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}
