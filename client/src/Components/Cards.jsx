import React from 'react';
import { Dumbbell, Repeat, Layers, Weight, Pencil, Trash2, Calendar } from 'lucide-react';

const ExerciseCard = ({ name, sets, reps, weight, date, onEdit, onDelete }) => {
    return (
        <div className="max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            {/* Date and Category Tag */}
            <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                    <Calendar size={12} />
                    {date || 'No Date'}
                </div>
            </div>

            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800 tracking-tight capitalize">{name}</h3>
                <span className="rounded-full bg-blue-50 p-2 text-green-600">
                    <Dumbbell size={20} />
                </span>
            </div>

            <hr className="mb-4 border-slate-100" />

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <Layers size={12} /> Sets
                    </div>
                    <p className="text-lg font-bold text-slate-700">{sets}</p>
                </div>

                <div className="flex flex-col items-center border-x border-slate-100 px-2">
                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <Repeat size={12} /> Reps
                    </div>
                    <p className="text-lg font-bold text-slate-700">{reps}</p>
                </div>

                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <Weight size={12} /> Weight
                    </div>
                    <p className="text-lg font-bold text-slate-700">
                        {weight}<span className="text-xs ml-0.5 font-medium text-slate-500">kg</span>
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <button
                    onClick={onEdit}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 active:bg-slate-100"
                >
                    <Pencil size={16} /> Edit
                </button>
                <button
                    onClick={onDelete}
                    className="flex items-center justify-center rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-red-600 transition-colors hover:bg-red-100 active:bg-red-200"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

export default ExerciseCard;