'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ChevronUp, ChevronDown, Search, Filter, CheckCircle, XCircle, Clock } from 'lucide-react';
import { SemestreTableData, NoteTableRow } from '@/types/resultat';

interface NotesDataTableProps {
  data: SemestreTableData;
  showRecours: boolean;
  onShowRecours: (showRecours: boolean) => void;
  renderRecours: (note: NoteTableRow) => React.ReactNode;
}

type SortField = keyof NoteTableRow;
type SortDirection = 'asc' | 'desc';

const NotesDataTable: React.FC<NotesDataTableProps> = ({ data, showRecours, onShowRecours, renderRecours }) => {
  const [sortField, setSortField] = useState<SortField>('cours');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [noteData, setNoteData] = useState<NoteTableRow>();
  // Fonction de tri
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Données filtrées et triées
  const filteredAndSortedData = useMemo(() => {
    if (!data.notes || data.notes.length === 0) {
      return [];
    }
    
    let filtered = data.notes.filter(note => {
      console.log("Note", note._id);
      
      const matchesSearch = 
        note.cours.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.unite.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || note.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Gestion des valeurs null pour les notes
      if (aValue === null) aValue = -1;
      if (bValue === null) bValue = -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [data.notes, sortField, sortDirection, searchTerm, statusFilter]);

  // Fonction pour obtenir la couleur de la moyenne
  const getMoyenneColor = (moyenne: number) => {
    if (moyenne >= 16) return 'text-green-700 bg-green-100';
    if (moyenne >= 14) return 'text-blue-700 bg-blue-100';
    if (moyenne >= 12) return 'text-yellow-700 bg-yellow-100';
    if (moyenne >= 10) return 'text-orange-700 bg-orange-100';
    return 'text-red-700 bg-red-100';
  };

  // Fonction pour obtenir l'icône du statut
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VALIDÉ':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'ÉCHEC':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'EN ATTENTE':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  // Composant d'en-tête de colonne
  const SortableHeader: React.FC<{ field: SortField; children: React.ReactNode }> = ({ field, children }) => (
    <th 
      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortField === field && (
          sortDirection === 'asc' 
            ? <ChevronUp className="w-4 h-4" />
            : <ChevronDown className="w-4 h-4" />
        )}
      </div>
    </th>
  );

  useEffect(() => {
    console.log("Note Data", noteData);
    
  }, [noteData]);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {!showRecours ? (
      <>
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          {/* <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {data.semestre.designation}
            </h3>
            <p className="text-sm text-gray-600">
              {data.semestre.description}
            </p>
          </div> */}
          {/* <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {data.statistiques.moyenneGenerale.toFixed(2)}/20
            </div>
            <div className="text-sm text-gray-500">Moyenne du semestre</div>
          </div> */}
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="text-lg font-bold text-gray-800">{data.notes?.length || 0}</div>
            <div className="text-xs text-gray-600">Cours</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="text-lg font-bold text-green-600">
              {data.statistiques.creditsValides}/{data.statistiques.totalCredits}
            </div>
            <div className="text-xs text-gray-600">Crédits</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="text-lg font-bold text-blue-600">
              {data.statistiques.pourcentageReussite.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-600">Réussite</div>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un cours ou une UE..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">Tous les statuts</option>
              <option value="VALIDÉ">Validé</option>
              <option value="ÉCHEC">Échec</option>
              <option value="EN ATTENTE">En attente</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <SortableHeader field="cours">Cours</SortableHeader>
              <SortableHeader field="unite">Unité d'Enseignement</SortableHeader>
              <SortableHeader field="cmi">CMI (/10)</SortableHeader>
              <SortableHeader field="examen">Examen (/10)</SortableHeader>
              <SortableHeader field="rattrapage">Rattrapage (/20)</SortableHeader>
              <SortableHeader field="moyenne">Moyenne (/20)</SortableHeader>
              <SortableHeader field="credit">Crédit</SortableHeader>
              <SortableHeader field="status">Statut</SortableHeader>
              <SortableHeader field="annee">Année</SortableHeader>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedData.map((note, index) => (
              <tr 
                key={index} 
                className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                onClick={() => {
                  console.log("Note Clicked", note);
                  setNoteData(note);
                  onShowRecours(true);
                }}
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{note.cours}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{note.unite}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <span className="text-sm text-gray-900">
                    {note.cmi !== null ? note.cmi.toFixed(2) : '-'}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <span className="text-sm text-gray-900">
                    {note.examen !== null ? note.examen.toFixed(2) : '-'}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <span className="text-sm text-gray-900">
                    {note.rattrapage !== null ? note.rattrapage.toFixed(2) : '-'}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMoyenneColor(note.moyenne)}`}>
                    {note.moyenne.toFixed(2)}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <span className="text-sm text-gray-900">{note.credit}</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(note.status)}
                    <span className={`text-xs font-medium ${
                      note.status === 'VALIDÉ' ? 'text-green-600' :
                      note.status === 'ÉCHEC' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {note.status}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">{note.annee}</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <span className="text-xs text-blue-600 hover:text-blue-800">
                    Cliquer pour recours
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </>
      ) : (
        renderRecours(noteData || (data.notes && data.notes[0]) || {} as NoteTableRow)
      )}
      
      {/* Footer avec résumé */}
      {filteredAndSortedData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Aucun résultat trouvé pour les critères sélectionnés</p>
        </div>
      )}

      {filteredAndSortedData.length > 0 && (
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Affichage de {filteredAndSortedData.length} cours sur {data.notes?.length || 0} total
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesDataTable;
