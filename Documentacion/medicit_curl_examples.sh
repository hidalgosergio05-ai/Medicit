#!/bin/bash
# ============================================================================
# MEDICIT API - EJEMPLOS CON cURL
# ============================================================================
# Usa este script para probar los endpoints desde línea de comandos
# Requisito: curl debe estar instalado
# Uso: bash medicit_curl_examples.sh

BASE_URL="http://localhost:8080"

echo "🧪 MEDICIT API - EJEMPLOS CON cURL"
echo "===================================="
echo ""

# ============================================================================
# 1. AUTENTICACIÓN
# ============================================================================

echo "1️⃣ LOGIN - Obtener usuario con permisos"
echo "----------------------------------------"

curl -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "nombreUsuario": "juanperez",
    "contrasenia": "password123"
  }' | json_pp

echo ""
echo ""

# ============================================================================
# 2. GESTIÓN DE PERMISOS
# ============================================================================

echo "2️⃣ OBTENER TODOS LOS PERMISOS"
echo "------------------------------"

curl -X GET "$BASE_URL/api/permisos" | json_pp

echo ""
echo ""

echo "3️⃣ OBTENER PERMISOS DE UN ROL ESPECÍFICO (Rol ID 1 - Medico)"
echo "-----------------------------------------------------------"

curl -X GET "$BASE_URL/api/permisos/rol/1" | json_pp

echo ""
echo ""

echo "4️⃣ OBTENER UN PERMISO POR ID"
echo "-----------------------------"

curl -X GET "$BASE_URL/api/permisos/1" | json_pp

echo ""
echo ""

echo "5️⃣ CREAR UN NUEVO PERMISO"
echo "-------------------------"

curl -X POST "$BASE_URL/api/permisos" \
  -H "Content-Type: application/json" \
  -d '{
    "rol": {
      "idRol": 2
    },
    "modulo": "modulo_reportes",
    "ver": true,
    "crear": true,
    "editar": true,
    "eliminar": false,
    "descargar": true
  }' | json_pp

echo ""
echo ""

echo "6️⃣ ACTUALIZAR UN PERMISO (ID 15)"
echo "--------------------------------"

curl -X PUT "$BASE_URL/api/permisos/15" \
  -H "Content-Type: application/json" \
  -d '{
    "rol": {
      "idRol": 2
    },
    "modulo": "modulo_reportes",
    "ver": true,
    "crear": false,
    "editar": true,
    "eliminar": false,
    "descargar": true
  }' | json_pp

echo ""
echo ""

echo "7️⃣ ELIMINAR UN PERMISO (ID 15)"
echo "------------------------------"

curl -X DELETE "$BASE_URL/api/permisos/15" \
  -H "Content-Type: application/json"

echo ""
echo ""

# ============================================================================
# 3. FLUJO COMPLETO: CREAR ROL → PERMISOS → USUARIO
# ============================================================================

echo "8️⃣ FLUJO COMPLETO: CREAR NUEVO ROL"
echo "-----------------------------------"

echo "Paso 1: Crear rol 'Especialista'"
RESPONSE=$(curl -X POST "$BASE_URL/api/roles" \
  -H "Content-Type: application/json" \
  -d '{
    "nombreRol": "Especialista",
    "descripcion": "Rol para especialistas del sistema"
  }')

echo "$RESPONSE" | json_pp
ROL_ID=$(echo "$RESPONSE" | grep -o '"idRol":[0-9]*' | grep -o '[0-9]*')
echo "✅ Rol creado con ID: $ROL_ID"

echo ""
echo "Paso 2: Crear permiso para modulo_usuarios"
curl -X POST "$BASE_URL/api/permisos" \
  -H "Content-Type: application/json" \
  -d "{
    \"rol\": {
      \"idRol\": $ROL_ID
    },
    \"modulo\": \"modulo_usuarios\",
    \"ver\": true,
    \"crear\": true,
    \"editar\": false,
    \"eliminar\": false,
    \"descargar\": false
  }" | json_pp

echo ""
echo "Paso 3: Crear permiso para modulo_citas"
curl -X POST "$BASE_URL/api/permisos" \
  -H "Content-Type: application/json" \
  -d "{
    \"rol\": {
      \"idRol\": $ROL_ID
    },
    \"modulo\": \"modulo_citas\",
    \"ver\": true,
    \"crear\": true,
    \"editar\": true,
    \"eliminar\": false,
    \"descargar\": true
  }" | json_pp

echo ""
echo "Paso 4: Crear permiso para modulo_antecedentes"
curl -X POST "$BASE_URL/api/permisos" \
  -H "Content-Type: application/json" \
  -d "{
    \"rol\": {
      \"idRol\": $ROL_ID
    },
    \"modulo\": \"modulo_antecedentes\",
    \"ver\": true,
    \"crear\": false,
    \"editar\": false,
    \"eliminar\": false,
    \"descargar\": true
  }" | json_pp

echo ""
echo "Paso 5: Validar permisos creados"
curl -X GET "$BASE_URL/api/permisos/rol/$ROL_ID" | json_pp

echo ""
echo "Paso 6: Crear usuario con el nuevo rol"
USUARIO_RESPONSE=$(curl -X POST "$BASE_URL/api/usuarios" \
  -H "Content-Type: application/json" \
  -d "{
    \"nombreUsuario\": \"especialista1\",
    \"nombres\": \"Carlos\",
    \"apellidos\": \"Gómez\",
    \"correo\": \"carlos@mail.com\",
    \"idRol\": $ROL_ID,
    \"idEstado\": 1
  }")

echo "$USUARIO_RESPONSE" | json_pp
USUARIO_ID=$(echo "$USUARIO_RESPONSE" | grep -o '"idUsuario":[0-9]*' | grep -o '[0-9]*')
echo "✅ Usuario creado con ID: $USUARIO_ID"

echo ""
echo "Paso 7: Crear contraseña para el usuario"
curl -X POST "$BASE_URL/api/contrasenias" \
  -H "Content-Type: application/json" \
  -d "{
    \"usuario\": {
      \"idUsuario\": $USUARIO_ID
    },
    \"contrasenia\": \"password123\"
  }" | json_pp

echo ""
echo "Paso 8: Login con el nuevo usuario (verificar permisos)"
curl -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "nombreUsuario": "especialista1",
    "contrasenia": "password123"
  }' | json_pp

echo ""
echo "✅ Flujo completo finalizado"

# ============================================================================
# 4. OPERACIONES ADICIONALES
# ============================================================================

echo ""
echo "9️⃣ OBTENER CITAS DEL PACIENTE (ID 3)"
echo "------------------------------------"

curl -X GET "$BASE_URL/api/citas/paciente/3" | json_pp

echo ""
echo ""

echo "🔟 OBTENER CITAS DEL MÉDICO (ID 5)"
echo "--------------------------------"

curl -X GET "$BASE_URL/api/citas/medico/5" | json_pp

echo ""
echo ""

echo "1️⃣1️⃣ OBTENER ANTECEDENTES DEL USUARIO (ID 5)"
echo "-------------------------------------------"

curl -X GET "$BASE_URL/api/antecedentes/usuario/5" | json_pp

echo ""
echo ""

echo "1️⃣2️⃣ CREAR ANTECEDENTE"
echo "---------------------"

curl -X POST "$BASE_URL/api/antecedentes" \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": {
      "idUsuario": 5
    },
    "antecedente": "Alergia a la penicilina"
  }' | json_pp

echo ""
echo "✅ Ejemplos completados"
