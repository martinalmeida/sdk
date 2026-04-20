<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $fillable = ['code', 'name'];

    public function municipalities()
    {
        return $this->hasMany(Municipality::class);
    }

    public function patients()
    {
        return $this->hasMany(Patient::class);
    }
}