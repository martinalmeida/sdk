<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    protected $fillable = [
        'document_type_id',
        'document_number',
        'first_name',
        'second_name',
        'first_surname',
        'second_surname',
        'gender_id',
        'department_id',
        'municipality_id',
        'email',
    ];

    public function documentType()
    {
        return $this->belongsTo(DocumentType::class);
    }

    public function gender()
    {
        return $this->belongsTo(Gender::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function municipality()
    {
        return $this->belongsTo(Municipality::class);
    }

    // Accessor para nombre completo
    public function getFullNameAttribute()
    {
        return trim(
            $this->first_name . ' ' . 
            $this->second_name . ' ' . 
            $this->first_surname . ' ' . 
            $this->second_surname
        );
    }
}