import { useState } from 'react';
import { Button, Card, Input } from '../ui';
import { useImmoStore } from '../store/immoStore';
import { Calculator, RotateCcw, Home, AlertCircle, TrendingUp, TrendingDown, Info, CheckCircle2, Building2, Plus, Trash2, Check, X, ExternalLink } from 'lucide-react';
import type { TypeBien, EtatGeneral, ClasseDPE, Exposition, DVFTransaction, AnnoncePAP, EstimationAgence } from '../types';

export default function ImmoEstimationApp() {
  const { 
    propertyData, sources, ponderations, ajustements, calculationResult, 
    setPropertyData, setPonderations, setAjustements, calculate, reset,
    addDVF, removeDVF, addAnnonce, removeAnnonce, addEstimation, removeEstimation
  } = useImmoStore();

  // États des formulaires d'ajout
  const [showAddDVF, setShowAddDVF] = useState(false);
  const [showAddAnnonce, setShowAddAnnonce] = useState(false);
  const [showAddEstimation, setShowAddEstimation] = useState(false);

  const [newDVF, setNewDVF] = useState<Partial<DVFTransaction>>({ prix: 0, surface: 0, date: '', adresse: '', commentaire: '' });
  const [newAnnonce, setNewAnnonce] = useState<Partial<AnnoncePAP>>({ prix: 0, surface: 0, pieces: 0, lien: '', source: 'Leboncoin', commentaire: '' });
  const [newEstimation, setNewEstimation] = useState<Partial<EstimationAgence>>({ prixMin: 0, prixMax: 0, source: 'Meilleurs Agents', date: '', commentaire: '' });

  const handleAddDVF = () => {
    if (newDVF.prix && newDVF.surface) {
      addDVF(newDVF as Omit<DVFTransaction, 'id'>);
      setNewDVF({ prix: 0, surface: 0, date: '', adresse: '', commentaire: '' });
      setShowAddDVF(false);
    }
  };

  const handleAddAnnonce = () => {
    if (newAnnonce.prix && newAnnonce.surface) {
      addAnnonce(newAnnonce as Omit<AnnoncePAP, 'id'>);
      setNewAnnonce({ prix: 0, surface: 0, pieces: 0, lien: '', source: 'Leboncoin', commentaire: '' });
      setShowAddAnnonce(false);
    }
  };

  const handleAddEstimation = () => {
    if (newEstimation.prixMin && newEstimation.prixMax) {
      addEstimation(newEstimation as Omit<EstimationAgence, 'id'>);
      setNewEstimation({ prixMin: 0, prixMax: 0, source: 'Meilleurs Agents', date: '', commentaire: '' });
      setShowAddEstimation(false);
    }
  };

  const canCalculate = propertyData.estimationName && 
                       propertyData.ville && 
                       propertyData.surface > 0 &&
                       (sources.dvf.length > 0 || sources.annonces.length > 0 || sources.estimations.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Full Width Image */}
      <section className="relative h-[700px] md:h-[850px] overflow-hidden">
        {/* Background Image Full Width */}
        <div className="absolute inset-0">
          <img 
            src="/appartement.svg" 
            alt="" 
            className="w-full h-full object-cover" 
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gray-900/70"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 h-full max-w-7xl relative z-10">
          <div className="flex items-center justify-center h-full">
            <div className="max-w-4xl text-center">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#ff6d11] to-[#E65A00] rounded-2xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* H1 */}
              <h1 className="text-5xl md:text-7xl font-black text-[#ff6d11] mb-6 tracking-tight">
                Estimation Immobilière
              </h1>

              {/* H2 */}
              <h2 className="text-3xl md:text-4xl text-white font-bold mb-8">
                Vendez votre bien au juste prix
              </h2>

              {/* H3 */}
              <h3 className="text-xl md:text-2xl text-white mb-10 leading-relaxed max-w-3xl mx-auto">
                Combinez les ventes réelles, les annonces du marché et les estimations professionnelles pour obtenir une estimation précise et argumentée.
              </h3>

              {/* Hero Proof */}
              <div className="flex flex-wrap justify-center gap-4 mb-10">
                <div className="flex items-center gap-2 text-sm font-semibold text-white bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20">
                  <CheckCircle2 className="w-5 h-5 text-[#ff6d11]" />
                  <span>Données du marché réel</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-white bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20">
                  <CheckCircle2 className="w-5 h-5 text-[#ff6d11]" />
                  <span>Ajustements personnalisés</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-white bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20">
                  <CheckCircle2 className="w-5 h-5 text-[#ff6d11]" />
                  <span>Rapport détaillé</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={reset} variant="outline" size="lg" className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20">
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Réinitialiser
                </Button>
                <Button onClick={calculate} variant="primary" size="lg" disabled={!canCalculate} className="bg-gradient-to-r from-[#ff6d11] to-[#E65A00] hover:from-[#E65A00] hover:to-[#cc4e00]">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculer l'estimation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Informations du bien */}
            <Card>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Informations du bien
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Input
                      label="Nom de cette estimation *"
                      placeholder="Ex: Appartement Paris 15ème"
                      value={propertyData.estimationName}
                      onChange={(e) => setPropertyData({ estimationName: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Type de bien *
                    </label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6d11] bg-white text-gray-900"
                      value={propertyData.typeBien}
                      onChange={(e) => setPropertyData({ typeBien: e.target.value as TypeBien })}
                    >
                      <option value="Appartement">Appartement</option>
                      <option value="Maison">Maison</option>
                      <option value="Terrain">Terrain</option>
                      <option value="Immeuble">Immeuble</option>
                      <option value="Local commercial">Local commercial</option>
                      <option value="Parking/Garage">Parking/Garage</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <Input
                      label="Adresse"
                      placeholder="Ex: 12 rue de la République"
                      value={propertyData.adresse}
                      onChange={(e) => setPropertyData({ adresse: e.target.value })}
                      helperText="Adresse complète du bien (optionnel)"
                    />
                  </div>

                  <div>
                    <Input
                      label="Ville *"
                      placeholder="Ex: Paris"
                      value={propertyData.ville}
                      onChange={(e) => setPropertyData({ ville: e.target.value })}
                    />
                  </div>

                  <div>
                    <Input
                      label="Code postal"
                      placeholder="Ex: 75015"
                      value={propertyData.codePostal}
                      onChange={(e) => setPropertyData({ codePostal: e.target.value })}
                    />
                  </div>

                  <div>
                    <Input
                      label="Surface (m²) *"
                      type="number"
                      min={0}
                      value={propertyData.surface}
                      onChange={(e) => setPropertyData({ surface: parseInt(e.target.value) || 0 })}
                    />
                  </div>

                  <div>
                    <Input
                      label="Nombre de pièces"
                      type="number"
                      min={1}
                      value={propertyData.pieces}
                      onChange={(e) => setPropertyData({ pieces: parseInt(e.target.value) || 1 })}
                    />
                  </div>

                  <div>
                    <Input
                      label="Nombre de chambres"
                      type="number"
                      min={0}
                      value={propertyData.chambres}
                      onChange={(e) => setPropertyData({ chambres: parseInt(e.target.value) || 0 })}
                    />
                  </div>

                  <div>
                    <Input
                      label="Étage"
                      type="number"
                      min={0}
                      placeholder="0 pour RDC"
                      value={propertyData.etage}
                      onChange={(e) => setPropertyData({ etage: parseInt(e.target.value) || 0 })}
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={propertyData.ascenseur}
                        onChange={(e) => setPropertyData({ ascenseur: e.target.checked })}
                        className="w-5 h-5 text-[#ff6d11] rounded focus:ring-2 focus:ring-[#ff6d11]"
                      />
                      <span className="text-sm font-medium text-gray-900">
                        Ascenseur
                      </span>
                    </label>
                  </div>

                  <div>
                    <Input
                      label="Année de construction"
                      type="number"
                      min={1800}
                      max={2026}
                      placeholder="Ex: 1990"
                      value={propertyData.anneeConstruction}
                      onChange={(e) => setPropertyData({ anneeConstruction: parseInt(e.target.value) || 2000 })}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* ====== SOURCES DE PRIX ====== */}
            <Card>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Sources de prix
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Ajoutez au moins une source pour lancer le calcul. Plus vous en ajoutez, plus l'estimation sera fiable.
                </p>

                {/* --- DVF Etalab --- */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900">
                      📊 Transactions DVF (Etalab)
                    </h3>
                    <Button onClick={() => setShowAddDVF(true)} variant="outline" size="sm" className="text-sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Ventes réelles enregistrées par l'État — <a href="https://app.dvf.etalab.gouv.fr/" target="_blank" rel="noopener noreferrer" className="text-[#ff6d11] underline">Consulter DVF Etalab</a>
                  </p>

                  {sources.dvf.length === 0 && !showAddDVF && (
                    <div className="p-4 bg-gray-100 rounded-lg text-center text-sm text-gray-500">
                      Aucune transaction DVF ajoutée
                    </div>
                  )}

                  {sources.dvf.map((d) => (
                    <div key={d.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg mb-2">
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900">
                          {d.prix.toLocaleString('fr-FR')} € — {d.surface} m² ({Math.round(d.prix / d.surface).toLocaleString('fr-FR')} €/m²)
                        </div>
                        <div className="text-xs text-gray-500">
                          {d.adresse && `${d.adresse} • `}{d.date && `${d.date} • `}{d.commentaire}
                        </div>
                      </div>
                      <button onClick={() => removeDVF(d.id)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {showAddDVF && (
                    <div className="p-4 bg-orange-50 rounded-lg border border-[#ff6d11]/20 mt-2">
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <Input
                          type="number"
                          placeholder="Prix de vente (€)"
                          value={newDVF.prix || ''}
                          onChange={(e) => setNewDVF({ ...newDVF, prix: Number(e.target.value) })}
                        />
                        <Input
                          type="number"
                          placeholder="Surface (m²)"
                          value={newDVF.surface || ''}
                          onChange={(e) => setNewDVF({ ...newDVF, surface: Number(e.target.value) })}
                        />
                        <Input
                          type="date"
                          placeholder="Date de vente"
                          value={newDVF.date || ''}
                          onChange={(e) => setNewDVF({ ...newDVF, date: e.target.value })}
                        />
                        <Input
                          placeholder="Adresse du comparable"
                          value={newDVF.adresse || ''}
                          onChange={(e) => setNewDVF({ ...newDVF, adresse: e.target.value })}
                        />
                        <div className="col-span-2">
                          <Input
                            placeholder="Commentaire (optionnel)"
                            value={newDVF.commentaire || ''}
                            onChange={(e) => setNewDVF({ ...newDVF, commentaire: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleAddDVF} variant="primary" size="sm">
                          <Check className="w-4 h-4 mr-1" /> Valider
                        </Button>
                        <Button onClick={() => setShowAddDVF(false)} variant="outline" size="sm">
                          <X className="w-4 h-4 mr-1" /> Annuler
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* --- Annonces marché --- */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900">
                      📰 Annonces du marché
                    </h3>
                    <Button onClick={() => setShowAddAnnonce(true)} variant="outline" size="sm" className="text-sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Annonces de biens similaires sur Leboncoin, SeLoger, PAP, Bien'ici...
                  </p>

                  {sources.annonces.length === 0 && !showAddAnnonce && (
                    <div className="p-4 bg-gray-100 rounded-lg text-center text-sm text-gray-500">
                      Aucune annonce ajoutée
                    </div>
                  )}

                  {sources.annonces.map((a) => (
                    <div key={a.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg mb-2">
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900">
                          {a.prix.toLocaleString('fr-FR')} € — {a.surface} m² — {a.pieces} pièces ({Math.round(a.prix / a.surface).toLocaleString('fr-FR')} €/m²)
                        </div>
                        <div className="text-xs text-gray-500">
                          {a.source}{a.commentaire && ` • ${a.commentaire}`}
                          {a.lien && (
                            <a href={a.lien} target="_blank" rel="noopener noreferrer" className="ml-2 text-[#ff6d11] inline-flex items-center gap-0.5">
                              <ExternalLink className="w-3 h-3" /> Voir
                            </a>
                          )}
                        </div>
                      </div>
                      <button onClick={() => removeAnnonce(a.id)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {showAddAnnonce && (
                    <div className="p-4 bg-orange-50 rounded-lg border border-[#ff6d11]/20 mt-2">
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <Input
                          type="number"
                          placeholder="Prix affiché (€)"
                          value={newAnnonce.prix || ''}
                          onChange={(e) => setNewAnnonce({ ...newAnnonce, prix: Number(e.target.value) })}
                        />
                        <Input
                          type="number"
                          placeholder="Surface (m²)"
                          value={newAnnonce.surface || ''}
                          onChange={(e) => setNewAnnonce({ ...newAnnonce, surface: Number(e.target.value) })}
                        />
                        <Input
                          type="number"
                          placeholder="Nb pièces"
                          value={newAnnonce.pieces || ''}
                          onChange={(e) => setNewAnnonce({ ...newAnnonce, pieces: Number(e.target.value) })}
                        />
                        <div>
                          <select
                            value={newAnnonce.source || 'Leboncoin'}
                            onChange={(e) => setNewAnnonce({ ...newAnnonce, source: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6d11] bg-white text-gray-900 text-sm"
                          >
                            <option value="Leboncoin">Leboncoin</option>
                            <option value="SeLoger">SeLoger</option>
                            <option value="PAP">PAP</option>
                            <option value="Bien'ici">Bien'ici</option>
                            <option value="Logic-Immo">Logic-Immo</option>
                            <option value="Autre">Autre</option>
                          </select>
                        </div>
                        <div className="col-span-2">
                          <Input
                            placeholder="Lien vers l'annonce (optionnel)"
                            value={newAnnonce.lien || ''}
                            onChange={(e) => setNewAnnonce({ ...newAnnonce, lien: e.target.value })}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            placeholder="Commentaire (optionnel)"
                            value={newAnnonce.commentaire || ''}
                            onChange={(e) => setNewAnnonce({ ...newAnnonce, commentaire: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleAddAnnonce} variant="primary" size="sm">
                          <Check className="w-4 h-4 mr-1" /> Valider
                        </Button>
                        <Button onClick={() => setShowAddAnnonce(false)} variant="outline" size="sm">
                          <X className="w-4 h-4 mr-1" /> Annuler
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* --- Estimations professionnelles --- */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900">
                      🏢 Estimations professionnelles
                    </h3>
                    <Button onClick={() => setShowAddEstimation(true)} variant="outline" size="sm" className="text-sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Meilleurs Agents, Yanport, agences locales, notaires...
                  </p>

                  {sources.estimations.length === 0 && !showAddEstimation && (
                    <div className="p-4 bg-gray-100 rounded-lg text-center text-sm text-gray-500">
                      Aucune estimation ajoutée
                    </div>
                  )}

                  {sources.estimations.map((e) => (
                    <div key={e.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg mb-2">
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900">
                          {e.prixMin.toLocaleString('fr-FR')} € — {e.prixMax.toLocaleString('fr-FR')} €
                          <span className="text-xs text-gray-500 ml-2">(moy. {Math.round((e.prixMin + e.prixMax) / 2).toLocaleString('fr-FR')} €)</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {e.source}{e.date && ` • ${e.date}`}{e.commentaire && ` • ${e.commentaire}`}
                        </div>
                      </div>
                      <button onClick={() => removeEstimation(e.id)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {showAddEstimation && (
                    <div className="p-4 bg-orange-50 rounded-lg border border-[#ff6d11]/20 mt-2">
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <Input
                          type="number"
                          placeholder="Prix min (€)"
                          value={newEstimation.prixMin || ''}
                          onChange={(e) => setNewEstimation({ ...newEstimation, prixMin: Number(e.target.value) })}
                        />
                        <Input
                          type="number"
                          placeholder="Prix max (€)"
                          value={newEstimation.prixMax || ''}
                          onChange={(e) => setNewEstimation({ ...newEstimation, prixMax: Number(e.target.value) })}
                        />
                        <div>
                          <select
                            value={newEstimation.source || 'Meilleurs Agents'}
                            onChange={(e) => setNewEstimation({ ...newEstimation, source: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6d11] bg-white text-gray-900 text-sm"
                          >
                            <option value="Meilleurs Agents">Meilleurs Agents</option>
                            <option value="Yanport">Yanport</option>
                            <option value="Efficity">Efficity</option>
                            <option value="Agence locale">Agence locale</option>
                            <option value="Notaire">Notaire</option>
                            <option value="Autre">Autre</option>
                          </select>
                        </div>
                        <Input
                          type="date"
                          placeholder="Date de l'estimation"
                          value={newEstimation.date || ''}
                          onChange={(e) => setNewEstimation({ ...newEstimation, date: e.target.value })}
                        />
                        <div className="col-span-2">
                          <Input
                            placeholder="Commentaire (optionnel)"
                            value={newEstimation.commentaire || ''}
                            onChange={(e) => setNewEstimation({ ...newEstimation, commentaire: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleAddEstimation} variant="primary" size="sm">
                          <Check className="w-4 h-4 mr-1" /> Valider
                        </Button>
                        <Button onClick={() => setShowAddEstimation(false)} variant="outline" size="sm">
                          <X className="w-4 h-4 mr-1" /> Annuler
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Compteur total */}
                <div className="mt-6 p-3 bg-gray-100 rounded-lg flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Total des sources</span>
                  <span className={`text-lg font-bold ${
                    (sources.dvf.length + sources.annonces.length + sources.estimations.length) >= 3
                      ? 'text-green-600' : 'text-[#ff6d11]'
                  }`}>
                    {sources.dvf.length + sources.annonces.length + sources.estimations.length} source(s)
                  </span>
                </div>
              </div>
            </Card>

            {/* Ajustements qualitatifs */}
            <Card>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Ajustements qualitatifs
                </h2>

                <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-800 leading-relaxed">
                        <strong>Ces ajustements sont facultatifs.</strong> Si vos sources correspondent déjà bien au bien, 
                        vous pouvez les ignorer. Utilisez-les uniquement pour affiner si votre bien diffère significativement 
                        des comparables (état, équipements, exposition, DPE...).
                      </p>
                    </div>
                  </div>
                </div>

                {/* État général */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    État général
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(['Neuf / récent', 'Bon', 'À rafraîchir', 'À rénover'] as EtatGeneral[]).map((etat) => {
                      const isSelected = ajustements.etatGeneral === etat;
                      const impacts: Record<EtatGeneral, string> = { 
                        'Neuf / récent': '+10%', 
                        'Bon': '0%', 
                        'À rafraîchir': '-8%', 
                        'À rénover': '-20%' 
                      };
                      
                      return (
                        <button
                          key={etat}
                          onClick={() => setAjustements({ etatGeneral: etat })}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            isSelected
                              ? 'border-[#ff6d11] bg-orange-50 shadow-lg shadow-orange-500/20'
                              : 'border-gray-300 hover:border-[#ff6d11] hover:bg-gray-50 bg-white'
                          }`}
                        >
                          <div className="text-sm font-semibold text-gray-900">
                            {etat}
                          </div>
                          <div className={`text-xs mt-1 font-semibold ${
                            isSelected ? 'text-white' : 'text-gray-700'
                          }`}>
                            {impacts[etat]}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* DPE */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Classe DPE
                  </label>
                  <select
                    value={ajustements.dpe}
                    onChange={(e) => setAjustements({ dpe: e.target.value as ClasseDPE })}
                    className="w-full md:w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6d11] bg-white text-gray-900"
                  >
                    <option value="A">A (+12%)</option>
                    <option value="B">B (+8%)</option>
                    <option value="C">C (+4%)</option>
                    <option value="D">D (0%)</option>
                    <option value="E">E (-5%)</option>
                    <option value="F">F (-12%)</option>
                    <option value="G">G (-20%)</option>
                    <option value="Non renseigné">Non renseigné (0%)</option>
                  </select>
                </div>

                {/* Équipements */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Équipements & confort
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { key: 'balcon', label: 'Balcon', bonus: '+5%' },
                      { key: 'terrasse', label: 'Terrasse', bonus: '+8%' },
                      { key: 'jardin', label: 'Jardin', bonus: '+12%' },
                      { key: 'parking', label: 'Parking', bonus: '+8%' },
                      { key: 'cave', label: 'Cave', bonus: '+3%' },
                      { key: 'vueDegagee', label: 'Vue dégagée', bonus: '+8%' },
                      { key: 'calme', label: 'Calme', bonus: '+5%' },
                      { key: 'proximiteTransports', label: 'Proximité transports', bonus: '+6%' },
                    ].map(({ key, label, bonus }) => (
                      <label key={key} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={ajustements[key as keyof typeof ajustements] as boolean}
                          onChange={(e) => setAjustements({ [key]: e.target.checked })}
                          className="w-5 h-5 text-[#ff6d11] rounded focus:ring-2 focus:ring-[#ff6d11]"
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900">
                            {label}
                          </span>
                          <span className="text-xs text-[#ff6d11] ml-2">{bonus}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Pondérations */}
            <Card>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Pondération des sources
                </h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-900">
                        📊 DVF (ventes réelles)
                      </label>
                      <span className="text-lg font-bold text-[#ff6d11]">{ponderations.dvf}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={ponderations.dvf}
                      onChange={(e) => setPonderations({ dvf: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-200  rounded-lg appearance-none cursor-pointer accent-[#ff6d11]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-900">
                        📰 Annonces PAP/Leboncoin
                      </label>
                      <span className="text-lg font-bold text-[#ff6d11]">{ponderations.annonces}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={ponderations.annonces}
                      onChange={(e) => setPonderations({ annonces: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-200  rounded-lg appearance-none cursor-pointer accent-[#ff6d11]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-900">
                        🏢 Estimations agences
                      </label>
                      <span className="text-lg font-bold text-[#ff6d11]">{ponderations.estimations}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={ponderations.estimations}
                      onChange={(e) => setPonderations({ estimations: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-200  rounded-lg appearance-none cursor-pointer accent-[#ff6d11]"
                    />
                  </div>
                </div>

                <div className={`mt-6 p-4 rounded-lg border-2 ${
                  (ponderations.dvf + ponderations.annonces + ponderations.estimations) === 100
                    ? 'bg-green-50 border-green-500' 
                    : 'bg-yellow-50 border-yellow-500'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {ponderations.dvf + ponderations.annonces + ponderations.estimations}%
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <div className="p-6">
                  {calculationResult ? (
                    <>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Prix estimé
                      </h3>
                      <div className="text-center mb-6">
                        <div className="text-5xl font-bold text-[#ff6d11] mb-2">
                          {calculationResult.prixFinal.toLocaleString('fr-FR')} €
                        </div>
                        <div className="text-sm text-gray-900">
                          {calculationResult.prixM2.toLocaleString('fr-FR')} € / m²
                        </div>
                        <div className="flex items-center justify-center gap-3 text-sm text-gray-900 mt-3">
                          <div className="flex items-center gap-1">
                            <TrendingDown className="w-4 h-4" />
                            <span>{calculationResult.fourchetteBasse.toLocaleString('fr-FR')} €</span>
                          </div>
                          <span>—</span>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>{calculationResult.fourchetteHaute.toLocaleString('fr-FR')} €</span>
                          </div>
                        </div>
                      </div>

                      {/* Score de confiance */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">Score de confiance</span>
                          <span className="text-xl font-bold text-[#ff6d11]">{calculationResult.scoreConfiance}/100</span>
                        </div>
                        <div className="w-full bg-gray-200  rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all ${
                              calculationResult.scoreConfiance >= 80 ? 'bg-green-500' :
                              calculationResult.scoreConfiance >= 60 ? 'bg-orange-500' :
                              calculationResult.scoreConfiance >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${calculationResult.scoreConfiance}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-900 mt-2">
                          {calculationResult.scoreConfiance >= 80 && '✅ Très fiable'}
                          {calculationResult.scoreConfiance >= 60 && calculationResult.scoreConfiance < 80 && '👍 Bonne estimation'}
                          {calculationResult.scoreConfiance >= 40 && calculationResult.scoreConfiance < 60 && '⚠️ Correcte'}
                          {calculationResult.scoreConfiance < 40 && '⚠️ Ajoutez plus de sources'}
                        </p>
                      </div>

                      {/* Positionnement marché avec jauge */}
                      <div className="mb-4">
                        <div className="text-xs font-semibold text-gray-900 mb-2">Positionnement marché</div>
                        <div className="relative h-6 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full mb-2">
                          <div className="absolute inset-0 flex items-center justify-between px-2 text-xs font-semibold text-white opacity-50">
                            <span>Bas</span>
                            <span>Moyen</span>
                            <span>Élevé</span>
                          </div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <span className={`text-sm font-bold ${
                            calculationResult.positionMarche === 'Très compétitif' ? 'text-green-600' :
                            calculationResult.positionMarche === 'Compétitif' ? 'text-green-500' :
                            calculationResult.positionMarche === 'Dans la moyenne' ? 'text-[#ff6d11]' :
                            calculationResult.positionMarche === 'Au-dessus' ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {calculationResult.positionMarche === 'Très compétitif' && '🎯 Très compétitif'}
                            {calculationResult.positionMarche === 'Compétitif' && '✅ Compétitif'}
                            {calculationResult.positionMarche === 'Dans la moyenne' && '📊 Dans la moyenne'}
                            {calculationResult.positionMarche === 'Au-dessus' && '⚠️ Au-dessus'}
                            {calculationResult.positionMarche === 'Élevé' && '🔴 Élevé'}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-900">
                        Remplissez les informations et cliquez sur "Calculer" pour obtenir votre estimation
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Disclaimer renforcé */}
        <div className="mt-12 p-6 bg-amber-50 rounded-lg border-2 border-amber-600">
          <h3 className="text-base font-bold text-amber-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Avertissement Important
          </h3>
          <p className="text-sm text-amber-900 leading-relaxed mb-3">
            <strong>MonPrixJuste est un outil indicatif uniquement.</strong> Cette estimation ne remplace en aucun cas :
          </p>
          <ul className="text-sm text-amber-900 space-y-1 ml-4 mb-3">
            <li>• Un avis de valeur professionnel (notaire, expert immobilier)</li>
            <li>• Une expertise immobilière certifiée</li>
            <li>• Une estimation d'agence immobilière</li>
          </ul>
          <p className="text-sm text-amber-900 leading-relaxed">
            Pour toute transaction importante, consultez impérativement un professionnel qualifié. Les données sont saisies manuellement et peuvent contenir des erreurs. Les prix du marché évoluent constamment.
          </p>
          <div className="mt-4 pt-4 border-t border-amber-400">
            <p className="text-xs text-amber-800">
              🔒 <strong>Confidentialité :</strong> Toutes les données sont traitées localement dans votre navigateur. Aucune information n'est envoyée à des serveurs externes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
